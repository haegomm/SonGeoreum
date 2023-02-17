# 손:걸음

### 🤖 README 작업 중입니다 🤖

<br>

![메인배너](etc/assets/logo_outline_blue.png)
![메인이미지](etc/assets/SonGeoreum_main_picture.png)

(현경님)

## 프로젝트 개요

SSAFY 8기 2학기 공통 프로젝트

2023.01.09 ~ 2023.02.17 (39일)

<br>

## [수어 관련 사회적 배경]

현재 농인들과 수어 관련한 어떤 사회적 배경이 있는지 기재합니다.
(오연님)

<br>

## [해결해야 할 문제점]

우리가 해결해야할 문제점을 명시하고, 우리의 서비스가 필요한 이유와 어떻게 이 문제를 개선/해결할 수 있는지 명확히 기재합니다.
(오연님)

<br>

## 주요기능

위에 서비스 화면과 같이 설명한 부분을 더 상세하게 기재합니다.
(현경님)

<br>

## 손:걸음 서비스 화면

여기에 간단한 기능설명과 함께 시연 GIF들을 추가합니다.
(현경님)

<br>

## 기술 차별점

기술적인 부분에서 우리의 서비스의 차별점을 상세히 기재합니다.
(모두)

<br>

## 개발환경

### Frontend

- Node.js 18.13.0 (LTS)
- React 18.2.0
  - Redux 4.2.1
- mui/material 5.11.6
- axios 1.2.6
- Sass 1.57.1
- Openvidu Browser 2.24.0
- jQuery 3.6.3

### Backend

- Java
  - Java OpenJDK 1.8.0
  - Spring Boot 2.7.7
    - Spring Data JPA 2.7.6
    - Spring Security 5.7.6
    - JUnit 4.13.2
    - Lombok 1.18.24
    - Swagger 3.0.0
  - Gradle 7.6
- Python
  - Python 3.8.10
  - Django 4.1.5
  - OpenCV 4.5.5.64
  - MediaPipe 0.9.0.1

### Server

- Ubuntu 20.04 LTS
- Nginx 1.18.0
- Docker 20.10.23
- Docker Compose 2.15.1
- OpenVidu 2.24.0

### Database

- MySQL (AWS RDS) 8.0.30

### UI/UX

- Figma 93.4.0

### IDE

- Visual Studio Code 1.75
- IntelliJ IDEA 2022.3.1
- PyCharm 22.3.2

### 기타 툴

- Postman 10.9.4
- Termius 7.56.1

<br>

## 프로젝트 구조

### Frontend (React)

```
SonGeoreum
├── app
├── assets
│   ├── category
│   ├── fonts
│   ├── home
│   ├── level
│   ├── logo
│   ├── profile
│   ├── result
│   └── socialLogin
├── common
│   ├── api
│   ├── button
│   ├── card
│   ├── category
│   ├── error
│   ├── navbar
│   └── routes
└── features
    ├── additional
    ├── auth
    │   ├── login
    │   ├── modify
    │   └── signup
    ├── game
    │   ├── effect
    │   └── openVidu
    │       ├── assets
    │       │   └── images
    │       ├── components
    │       │   ├── dialog-extension
    │       │   ├── sidebar
    │       │   │   └── chat
    │       │   ├── stream
    │       │   └── toolbar
    │       ├── docker
    │       ├── layout
    │       └── models
    ├── home
    ├── study
    │   ├── learn
    │   └── test
    └── voca
```

### Backend (Spring Boot)

```
SonGeoreum
├── api
│   ├── controller
│   ├── request
│   ├── response
│   └── service
├── config
├── db
│   ├── domain
│   └── repository
├── exception
├── jwt
│   └── filter
├── oauth
│   ├── entity
│   ├── handler
│   ├── info
│   └── service
└── util
```

### Backend (Django)

```
SonGeoreum
├── Dockerfile
├── README.md
├── handdetection
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── consumers.py
│   ├── knn.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── routing.py
│   ├── templates
│   │   └── handdetection
│   │       └── lobby.html
│   ├── tests.py
│   ├── urls.py
│   └── views.py
├── knn_dataset_consonant.txt
├── knn_dataset_number.txt
├── knn_dataset_vowel.txt
├── manage.py
├── mywebsite
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── requirements.txt
```

<br>

## 와이어프레임

![Wireframe](docs/SonGeoreum_wireframe.png)
(가은님)

<br>

## ERD

![ERD](docs/SonGeoreum_erd.png)
(가은님)

<br>

## 서비스 아키텍쳐

![Architecture](docs/SonGeoreum_architecture.png)
(가은님)

<br>

## 협업 툴

- Git
- GitLab
- Jira
- Notion
- Mattermost

<br>

## 협업 환경

협업 환경을 상세히 기재합니다. (Git Flow, Jira, 회의(Scrum, Spring), Notion 활용 방법 등
(민혁님)
(가은님)

<br>

## 팀원 역할

![Team Members](etc/assets/SonGeoreum_members.jpg)
(정주님)

<br>

## 프로젝트 산출물

- [요구사항정의서](docs/SonGeoreum_%EC%9A%94%EA%B5%AC%EC%82%AC%ED%95%AD%EC%A0%95%EC%9D%98%EC%84%9C.pdf)
- [기능명세서](docs/SonGeoreum_%EA%B8%B0%EB%8A%A5%EB%AA%85%EC%84%B8%EC%84%9C.pdf)
- [와이어프레임](docs/SonGeoreum_wireframe.png)
- [ERD](docs/SonGeoreum_erd.png)
- [아키텍쳐 다이어그램](docs/SonGeoreum_architecture.png)
- [API DOCS](docs/SonGeoreum_api.pdf)
- [Git Convention](docs/SonGeoreum_git_convention.pdf)
- [포팅 매뉴얼](exec/SonGeoreum_%ED%8F%AC%ED%8C%85_%EB%A7%A4%EB%89%B4%EC%96%BC.pdf)

<br>

## 프로젝트 발표자료

- [중간발표 Presentation](docs/SonGeoreum_%EC%A4%91%EA%B0%84%EB%B0%9C%ED%91%9C%EC%9E%90%EB%A3%8C.pdf)
- [최종발표 Presentation]
  (정주님)

<br>

## 회고

프로젝트를 진행하며 배운 점들과 느낀 점들을 기재합니다.
(모두)
