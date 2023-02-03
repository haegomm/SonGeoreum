import json
import numpy as np
from channels.generic.websocket import WebsocketConsumer
from . import knn


class HanddetectionConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.gesture = {0: 'ㄴ', 1: 'ㄷ', 2: 'ㄹ', 3: 'ㅁ', 4: 'ㅂ', 5: 'ㅅ', 6: 'ㅇ', 7: 'ㅈ', 8: 'ㅊ', 9: 'ㅋ', 10: "ㅌ", 11: 'ㅍ',
                   12: 'ㅎ', 13: "ㄱ"}
        self.knn = knn.knn_factory('consonant')

    def connect(self):
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected!'
        }))

        print(self.scope['url_route']['kwargs']['category'])

    def receive(self, text_data=None):

        # get json message
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # calculate angles
        joint = np.zeros((21, 3))
        for j, lm in enumerate(message):
            joint[j] = [lm['x'], lm['y'], lm['z']]
        v1 = joint[[0, 1, 2, 3, 0, 5, 6, 7, 0, 9, 10, 11, 0, 13, 14, 15, 0, 17, 18, 19], :]
        v2 = joint[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], :]
        v = v2 - v1
        v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]

        compareV1 = v[[0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17], :]
        compareV2 = v[[1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19], :]

        angle = np.arccos(np.einsum('nt,nt->n', compareV1, compareV2))
        angle = np.degrees(angle)

        print(angle)

        data = np.array([angle], dtype=np.float32)
        ret, results, neighbors, dist = self.knn.findNearest(data, 3)
        index = int(results[0][0])

        # send prediction result
        self.send(text_data=json.dumps(
            {'response': self.gesture[index]}
        ))

        # print("message: ",message)
