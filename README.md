# 직비(직구 가격 비교 사이트)
해당 Repo는 Front 부분입니다

Other: Selenium
DB: Redis
Front-End: React
Language: Javascript, Python, React.js
MiddleWare: FastAPI, WebSocket


![Untitled 1](https://user-images.githubusercontent.com/11683617/230627339-ce8438d2-01a1-464c-a04d-58b1f36b6636.png)



# 기획 의도

검색창에 상품명을 입력하면 오픈 마켓마다 가장 싼 최저가를 구해주는 사이트

인터넷에 일일이 발품 뛰는 나 자신의 모습을 보면서 이 과정을 자동으로 해줬으면 좋겠다라는 생각으로 제작하게 됨

# 역할

FrontEnd

- 웹으로 개발하는 것이 범용성이 좋다고 판단해 React로 개발
- 데이터 수집 시에는 백그라운드로 수행할 수 있게 해 사이트 탐색이 가능하도록 하였음

BackEnd

- 검색창에 입력한 데이터를 WebSocket으로 서버와 통신
- 파이썬으로 개발 당시 동시다발적으로 작업이 발생할 것을 고려해
**멀티프로세스를 이용 병렬처리로 많은 사용자가 데이터 수집을 시도해도
동시에 데이터 수집 가능**
- **악의적인 데이터 수집 방지**를 위해 DB에서 6시간이 지나지 않은 상품 데이터는 데이터 수집을 생략하고 바로 표시
- FastAPI와 Redis를 이용해 RESTAPI 형식의 DB 구축
- 웹 스크랩핑 봇을 모듈식처럼 제작이 가능하도록 설계해 원하는 사이트에 대한 스크랩핑 봇을 개발해 기존 소스에 import만 해도 사용할 수 있도록 설계

Data Collection

- Selenium, BeautifulSoup4를 활용한 데이터 수집 봇을 제작
- 제품 자동완성 데이터는 아마존 자동완성 기능을 활용
추후 쿠팡의 해외직구 상품명 데이터를 가져와 자체 자동완성 DB에 저장
- 사용자 검색어를 DB에 자동으로 저장해 자동완성 기능으로 활용할 수 있게 제작

# 결과

사용자의 접근성을 최대한 높이기 위해선 자동완성 데이터가 매우 중요하다고 생각했는데 아마존의 자동완성 데이터가 쉽게 접근 가능해 자동완성에 대한 데이터 수집 과정을 대폭 줄일 수 있었음

서버에서 스크랩핑 작업을 할 수 있게 만들어, 사용자가 여러 제품을 검색할 수 있게 할 수 있도록 해 편의성 증가

악의적인 데이터 수집 방지를 위해 만료 시간을 넣어 서버의 불필요한 스크랩핑을 방지 할 수 있게 되어 서버의 자원을 아낄 수 있었음

## 1. 리액트를 이용해 페이지 구현

---

![Untitled 1](https://user-images.githubusercontent.com/11683617/230627339-ce8438d2-01a1-464c-a04d-58b1f36b6636.png)



## 2. 아마존 자동완성을 이용한 상품명 불러오기

---

![Untitled 2](https://user-images.githubusercontent.com/11683617/230627395-df494fc6-1798-4bdc-8bf9-157c041db680.png)


아마존의 자동완성은 이용할 수 있게 열려있고
제품명 위주로 되어있는 아마존의 자동완성이 적합하다고 판단

## 3. 반응형으로 만들어 PC & Mobile 대응

---

[Untitled.webm](https://user-images.githubusercontent.com/11683617/230627458-e40817ac-222e-4b84-80c9-58cae0d3e026.webm)


## 4. 웹소켓을 이용해 백그라운드로 데이터 스크래핑
### 전체적인 설계
---


![제목 없는 다이어그램 drawio](https://github.com/munhyok/Zikbee-Front/assets/11683617/fdf4b7b4-6dc8-4795-aa70-54ad5817dd72)



**시기**

- 프로젝트 진행 기간 (2022.10 ~ 2023.02)
