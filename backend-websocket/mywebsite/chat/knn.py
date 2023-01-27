import cv2
import numpy as np


def knn_factory(category):
    if (category == 'consonant'):
        file = np.genfromtxt('knn_dataset_consonant.txt', delimiter=",")
        angleFile = file[1:, :-1]
        labelFile = file[1:, -1]
        angle = angleFile.astype(np.float32)
        label = labelFile.astype(np.float32)
        knn = cv2.ml.KNearest_create()
        knn.train(angle, cv2.ml.ROW_SAMPLE, label)
        return knn

