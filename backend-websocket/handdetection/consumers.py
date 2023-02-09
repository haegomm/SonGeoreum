import json
from channels.generic.websocket import WebsocketConsumer
from . import knn
import logging


class HanddetectionConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)

        # Transfer Category PK to Category Name
        self.category_mapper = {'1': 'consonant', '2': 'vowel', '3': 'number'}
        self.knn = None
        self.logger = logging.getLogger('django.server')

    def connect(self):
        self.accept()

        category_pk = self.scope['url_route']['kwargs']['category']
        # self.knn = knn.Knn(category=self.category_mapper[category_pk])
        if category_pk == '1':
            knn_factory = knn.ConsonantKnnFactory()
            self.knn = knn_factory.create_knn()
        elif category_pk == '2':
            knn_factory = knn.VowelKnnFactory()
            self.knn = knn_factory.create_knn()
        elif category_pk == '3':
            knn_factory = knn.NumberKnnFactory()
            self.knn = knn_factory.create_knn()

        self.logger.info("WebSocket Connected with " + self.category_mapper[category_pk])

        # Send Message If Connected Successfully
        msg = {
            'category': self.category_mapper[category_pk],
            'message': 'You are now connected!'
        }
        self.send_message(msg)

    def receive(self, text_data=None):
        # Get JSON Message
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        response_msg = ''
        msg = {}
        host = str(self.scope['client'][0])
        port = str(self.scope['client'][1])
        client = host + ":" + port
        debug_msg = ''
        for dict_msg in message:
            debug_msg += json.dumps(dict_msg)
        self.logger.debug("From " + "[" + client + "]" + " message: "+ debug_msg)

        # Send Result
        try:
            response_msg = self.knn.predict(message)
            self.logger.debug("To " + client + " response: " + response_msg)
        except:
            response_msg = '유효한 데이터가 아닙니다.'
            self.logger.error('ERROR FROM: ', client)

        msg = {'response': response_msg}
        self.send_message(msg)

    def send_message(self, msg):
        self.send(text_data=json.dumps(
            msg
        ))
