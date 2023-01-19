# To Do

## 💚 1월 16일 월요일

✅ 스프린트 회의

✅ 깃 플로우 협의

✅ 컨벤션 공유

✅ 기능 명세서 작성

    https://www.notion.so/ee6638299edf4172a4585fd3e994a27e?v=be78dc2b878d4545a8c55ead7271b652

<br>

## 💚 1월 17일 화요일

✅ 스크럼 회의

✅ 컨셉 및 디자인 회의

✅ 프로토타입

    https://www.figma.com/file/1Y05KDBuV3sLSCdwyYaN0l/BBB_PJT?node-id=7%3A2&t=KbfTw9jXOubkDE6F-1

<br>

## 💚 1월 18일 수요일

✅ 스크럼 회의

✅ 디렉토리(컴포넌트) 정리

```

frontend
├── node_modules
├── public
└── src
    ├── api // proxy
    ├── assets // png, svg
    ├── components
    │   ├── button
    │   ├── card
    │   ├── icon
    │   ├── input
    │   ├── modal
    │   ├── nameSquare
    │   ├── navbar
    │   ├── spinner
    │   └── timer
    ├── features
    │   ├── signup
    │   ├── login
    │   ├── learn
    │   │   ├── voca // 기본 학습하기
    │   │   ├── myVoca // 나의 단어장
    │   │   └── learnObject
    │   ├── test
    │   │   ├── teachableMachine
    │   │   └── testObject
    │   └── game
    │       ├── openVidu
    │       └── gameObject
    ├── pages // HO, ST, TE, GA, VO
    └── utils // token, etc.

```

- css는 각 컴포넌트 및 페이지와 동일한 경로에 생성
- ui 관련 스크립트 : `jsx` , 그 외 : `js`

✅ 컨벤션 협의

    [Frontend Code Style Guide](https://jobs.class101.net/1dc83442-c2d4-4162-94ae-4d04717f1ae0#ef30922b-c65f-452c-92c3-e98dfd147201)

✅ 프로토타입

<br>

<aside>

## 💚 1월 19일 목요일

</aside>

✅ 스크럼 회의

✅ 주간 미팅

✅ 프로토타입 마무리

✅ 개발 환경 세팅

    [Windows 10 Home에서 Docker 설치하기](https://kk-7790.tistory.com/125)

<aside>
✅ 도커 4.5.1 버전으로 설치하기

</aside>

- 4.5.1을 검색해서 설치??

  ### 1️⃣ powershell 관리자 권한으로 실행

  1. 윈도우에서 리눅스 환경이 실행 가능하도록

     `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`

  2. VirtualMachinePlatform 기능을 활성화

     `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

  3. 재부팅
  4. 설치한 WSL2 Linux 커널을 업데이트

     [WSL 설치](https://docs.microsoft.com/ko-kr/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package)

     [](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

     ![Next를 누르면 자동 설치](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c8d92e2d-3d7b-47bf-bf75-44c23612592d/Untitled.png)

     Next를 누르면 자동 설치

     에러 : this update only applies to machines with the windows subsystem for linux

     Windows 기능 켜기/끄기 메뉴로 진입하여, Windows subsystem for Linux(Linux용 Windows 하위 시스템)과 Virtual Machine Platform(가상 머신 플랫폼) 체크박스를 해제하고, 확인을 누른 후 안내에 따라 PC를 재부팅 한 후, 이번에는 동일한 두개의 설정을 다시 체크박스 활성화 한 후, 다시 한번 재부팅 합니다.

  5. cmd 창에 `wsl --set-default-version 2` 입력해 설치

  ### 2️⃣ Ubuntu 실행

  1. Microsoft Store에서 `Ubuntu 22.04.1 LTS` 설치

  → 싸피 와이파이로 설치가 안되는 것으로 추정 : 0x80D02017 오류

  2. Installing. this may take few minutes… 메시지를 확인하고 기다리면

     username(계정명), 비밀번호 설정

     > username : ssafy
     >
     > password : 1234

     잘 완료 됐으면 아래 사진처럼 확인

     ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/27e171a4-bc6c-4e20-869a-2b6aee3c9cdf/Untitled.png)

  3. powershell(cmd)에서 우분투 설치 버전 확인 `wsl -l -v`

     ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c175f978-2321-4d2a-a5a8-b3dddc7cb073/Untitled.png)

     만약 1로 되어 있는경우 : `wsl --set-version Ubuntu 2`

  ### 3️⃣ docker 설치

  1. docker desktop 설치

     [Download Docker Desktop | Docker](https://www.docker.com/products/docker-desktop)
