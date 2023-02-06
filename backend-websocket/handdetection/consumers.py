import json
import numpy as np
from channels.generic.websocket import WebsocketConsumer
from . import knn


class HanddetectionConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

        # Transfer Category PK to Category Name
        self.category_mapper = {'1':'consonant', '2':'vowel', '3':'number'}
        self.knn = None

    def connect(self):
        self.accept()

        category_pk = self.scope['url_route']['kwargs']['category']
        self.knn = knn.Knn(category=self.category_mapper[category_pk])

        # Send Message If Connected Successfully
        self.send(text_data=json.dumps({
            'category': self.category_mapper[category_pk],
            'message': 'You are now connected!'
        }))

    def receive(self, text_data=None):

        # Get JSON Message
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send Result
        self.send(text_data=json.dumps(
            {'response': self.knn.predict(message)}
        ))