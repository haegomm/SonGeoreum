## SonGeoreum Django websocket project

### 소개

손동작 인식을 위한 websocket Django 서버입니다.

사람의 손동작을 인식해 사전에 학습된 모델을 사용해 분류합니다.

지문자(모음, 자음), 지숫자를 인식할 수 있습니다.

### 손동작 인식 방법

사전에 준비해 둔 데이터셋을 기반으로 들어온 입력값을 KNN(k-Nearest-Neighbor) 알고리즘으로 분류합니다.

입력값은 [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html) 라이브러리를 사용해 발생한 손의 21개 랜드마크 배열입니다. 

결과값은 모델을 사용해 분류한 결과입니다. ex) 'ㄱ','ㄴ','ㄷ'

### 개발 환경

- Pycharm
- Window

### 가상환경 실행

프로젝트 실행을 위해 독립적인 가상환경으로 접속한다.

    .\venv\Scripts\activate

- 터미널에 `(venv)` 표시가 떠있으면 가상환경 접속 완료.

### 라이브러리 설치

서버 실행을 위한 라이브러리를 설치한다.

    pip install -r requirements.txt

### 서버 실행

    python manage.py runserver

### 접속 확인

    http://127.0.0.1:8000/

### 웹소켓 경로
    
    자음
    ws://localhost:8000/ws/socket-server