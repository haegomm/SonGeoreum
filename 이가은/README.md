# *20230116*
## 기능 명세서 작성

<br>

## 개인 학습

<br>

## 🎀 useRef

🤍 useRef 함수를 호출해서 어떤 반환값을 상수에 담는다

```jsx
const DiaryEditor = () => {
  ***const authorInput = useRef();***

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1
  });
```

🤍 authorInput 상수에는 React.MutableRefObject가 저장되어있다(?)

🤍 React.MutableRefObject는 HTML, DOM 요소에 접근할 수 있는 기능을 함

---

```jsx
return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          ***ref={authorInput}***
          value={state.author}
          onChange={handleChangeState}
          name="author"
          placeholder="작성자"
          type="text"
        />
      </div>
```

🤍 authorInput 레퍼런스 객체를 input에 `ref = {authorInput}` 로 작성해서 전달해주게 되면 authorInput 라는 레퍼런스 객체를 통해서 input 태그에 접근할 수 있게 됨

🤍 useRef로 생성한 레퍼런스 객체는 현재 가리키는 값을 current라는 property로 불러와서 사용할 수 있음

🤍 authorInput.current는 authorInput 태그가 되는 것

---

# *20230117*
## 프로토타입 작업 시작

<br>

## 개인 학습

## 🎀 배열 데이터 props 전달

- DiaryList.js 파일을 생성

```jsx
// DiaryList.js
const DiaryList = () => {
  return <div className="DiaryList"></div>
}

export default DiaryList;
```

- DiaryList를 App컴포넌트에 자식으로 배치하기

```jsx
// App.js
import React, { useState, useEffect } from 'react';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const App = () => {
	return (
		<div className="App">
		<DiaryEditor />
		<**DiaryEditor** />
		</div>
	);
};

export default App;
```

- 임시데이터 props로 DiaryList에 전달하기

```jsx
// App.js
import React, { useState, useEffect } from 'react';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const dummyList = [
	{
		id:1,
		author:"해곰",
		content:"안농",
		emotion:5,
		created_date: new Date().getTime(),
	},
	...
]

const App = () => {
	return (
		<div className="App">
		<DiaryEditor />
		<**DiaryEditor diaryList = {dummyList}** /> // props로 전달
		</div>
	);
};

export default App;
```

- DiaryList에서 props 전달받기

```jsx
// DiaryList.js
const DiaryList = ({**diaryList**}) => {
  return (
		<div className="DiaryList">
			<h4>{**diaryList.length**}개의 일기가 있습니다.</h4>
		</div>
	)
}

export default DiaryList;

```

- 배열을 List로 렌더링하기

```jsx
// DiaryList.js
const DiaryList = ({**diaryList**}) => {
  return (
		<div className="DiaryList">
			<h4>{**diaryList.length**}개의 일기가 있습니다.</h4>
			<div>
				{**diaryList.map(it) => {
					<div>일기아이템</div>
			}**}
			</div>
		</div>
	)
}

export default DiaryList;

```

```jsx
<div>
	{diaryList.map(it) => {
		<div>일기아이템</div>
	}}
</div>
```

```jsx
<div>일기아이템</div>
<div>일기아이템</div>
<div>일기아이템</div>
```

---

## defaultProps

- undefined 로 prop이 내려왔을 때 해결방법
- `defaultProps` 사용!
    - undefined로 전달될거 같은 props들의 기본값을 설정할 수 있는 기능

- diaryList의 기본값 빈배열로 설정

```jsx
DiaryList.defaultProps={
	diaryList:[]
}
```

---

## “key” prop

- 리스트 렌더링을 했을 때, 리스트의 각각의 자식 요소들은 반드시 고유한 **“key” prop**을 받아야 함

```jsx
// DiaryList.js
const DiaryList = ({diaryList}) => {
  return (
		<div className="DiaryList">
			<h4>{diaryList.length}개의 일기가 있습니다.</h4>
			<div>
				{diaryList.map(it) => {
					<div key={it.id}>일기아이템</div>
			}}
			</div>
		</div>
	)
}

export default DiaryList;

```

- 데이터에 고유한 id가 없는 경우
    - map매장함수의 두번

```jsx
// DiaryList.js
const DiaryList = ({diaryList}) => {
  return (
		<div className="DiaryList">
			<h4>{diaryList.length}개의 일기가 있습니다.</h4>
			<div>
				{diaryList.map(it, idx) => {
					<div key={idx}>일기아이템</div>
			}}
			</div>
		</div>
	)
}

export default DiaryList;

```

⚠️ 배열의 인덱스를 사용하게 되면 데이터를 수정,삭제,추가해서 인덱스의 순서가 바뀌어 버렸을 때 문제가 생길 수 있음⚠️야

---

## 배열 데이터 아이템 컴포넌트

- 배열 데이터를 사용해서 렌더하는 아이템을 별도의 컴포넌트로 분할하기

- DiaryItem.js 컴포넌트 만들기

```jsx
// DiaryItem.js
const DiaryItem= () => {
  return <div className="DiaryItem">
  </div>
}

export default DiaryItem
```

```jsx
// DiaryList.js
import DiaryItem from './DiaryItem.js';

const DiaryList = ({diaryList}) => {
  return (
		<div className="DiaryList">
			<h4>{diaryList.length}개의 일기가 있습니다.</h4>
			<div>
				{diaryList.map(it) => {
					<DiaryItem key={it.id} {...it} />
			}}
			</div>
		</div>
	)
}

export default DiaryList;
```

- 리스트item이기 때문에 key 전달
- 일기 하나에 포함된 모든 객체의 데이터를 스프레드 연산자를 통해서 전달
    - it라는 객체에 포함된 모든 데이터가 item으로 prop으로 전달됨
    
- DiaryItem 마크업

```jsx
// DiaryItem.js
const DiaryItem= ({author, content, create_date, emotion, id}) => {
  return <div className="DiaryItem">
	<div className="DiaryItem">
      <span>작성자: {author} | 감정점수 : {emotion}</span>
			<br />
      <span className="date">{new Date(create_date).toLocaleDateString()}</span>
    </div>
    <div className="content">{content}</div>
  </div>
  </div>
}

export default DiaryItem
```


# 20230118

## 프로토타입 작업
## FE 컨벤션 정하기
## 디렉토리 구조 정하기

<br>

## 개인 학습

<br>

## 🎀 배열 사용하기-데이터 추가하기

## 컴포넌트 & 데이터 구조 생각해보기

- React에서 같은 레벨 간 데이터를 주고 받는 건 불가능

- 위에서 아래로만 데이터를 넘겨 줄 수 있음
- 이런 React의 흐름을 단방향 흐름이라고 함

- Editor에서 List로 데이터 넘겨주기


- Editor와 List의 공통 부모인 App 컴포넌트가 일기데이터를 state(배열방식)로 가지고 있고
    
    datastate의 값을 List에 전달하면서 배열을 렌더링하게 하고 
    
    데이터라는 state를 변화시킬 수 있는 상태변화 함수인 setData함수를  Editor로 prop으로 전달해주면 됨
    
- 리스트(아이템) 추가 과정


- data는 item1만 가지고 있는 배열
- 그 data를 props로 내려받은 DiaryList 컴포넌트는 하나의 item1만 렌더링하고 있는 상태
- 일기 작성폼인 DiaryEditor 컴포넌트에서 새로운 일기가 작성됨

1️⃣ App 컴포넌트가 DiaryEditor에게 prop으로 전달한 setData함수(상태변화 함수)를 호출하게 됨

2️⃣ 그러면 setData함수는 data에 새로운 아이템을 추가하도록 데이터 상태의 값을 바꿈 → 데이터 추가가 일어남

3️⃣ data state가 변경 되었음

DiaryList컴포넌트에게 전달하는 prop인 data가 추가된 아이템까지 포함한 새로운 data가 prop으로 내려가게 됨

4️⃣ DiaryList는 전달받은 prop이 바뀌었으니깐 리렌더링 됨

---
🤍 React의 컴포넌트들은 tree형태의 구조를 띈다.

🤍 데이터는 위에서 아래로만 흐르는 단방향 데이터 흐름이다.

🤍 추가, 수정, 삭제 등의 이벤트들은 핸들링하는 setData같은 함수를 props로 전달 ⇒ 이벤트들은 아래에서 위로 올라가는 구조를 띈다.

- 이벤트가 발생하면 부모 컴포넌트에서 전달한 상태변화 함수를 호출하여 data를 바꿈. 그래서 이벤트는 위쪽으로 일어나게 됨
- 데이터가 변화하게 되면 다시 아래로 떨구기 때문에 data는 아래로 흐르게 됨

💙 여러 개의 컴포넌트로 엮인 데이터를 그들의 공통 부모의 컴포넌트에 state로 설정하여 데이터를 전달하는 방법을 `"state 끌어올리기"` 라고 함

---

- App.js

```jsx
import { useState, useRef } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

function App() {
  const [data, setData] = useState(**[]**)

  const dataId = useRef(0)

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime()
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id : dataId.current
    }
    dataId.current += 1
    setData([newItem, ...data])
  }

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} />

    </div>
  )
}
```

- DiaryEditor.js

```jsx
const DiaryEditor = () => {
  const authorInput = useRef();
  const contentInput = useRef();

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1
  });

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    **onCreate(state.author, state.content, state.emotion);**
    alert("저장 성공!");
		setState({
			author: "",
	    content: "",
	    emotion: 1
		})
  };
```

# 20230119
## 프로토타입 마무리
## 주간 미팅

<br>

## 개인 학습

<br>

## 🎀 

---
<br>

# 20230119
## OpenVidu 지식 공유
## OpenVidu 코드 뜯어보기

<br>

## 개인 학습

<br>

## 🎀 