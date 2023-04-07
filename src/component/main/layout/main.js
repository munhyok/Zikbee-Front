import './main.css';
import {useState, useEffect} from 'react';
import {FaSearch} from "react-icons/fa";
import Modal from 'react-modal';
import {Link, useNavigate} from "react-router-dom";



function timeNow(){
    var today = new Date();   

    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 

    var timeString = hours + ':' + minutes  + ':' + seconds;

    return timeString

}



const kwdPost = (keyword) => {
    fetch("http://127.0.0.1:5200/autokwd", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
          path: "autokwd",
          autokwd: keyword,
        }),
      })
      .then((response) => response.json())
      .then((result) => console.log(result));
}



export function Main() {

    

    const nav = useNavigate();
    const [data, setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [crawlstate_, setCrawlstate] = useState(false);
    const [completeData, setCompleteData] = useState([]);
    const [nalKwdData, setNalKwdData] = useState([])
    const [keyword, setKeyword] = useState("");
    const [isComposing, setIsComposing] = useState(false)
    
    
    
    
    const fetchAutocomplete = (keyword_) => {
        const dummyList = []
        return fetch(
            'https://completion.amazon.com/api/2017/suggestions?session-id=133-4736477-7395454&customer-id=&request-id=4YM3EXKRH1QJB16MSJGT&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=71&prefix='+keyword_+'&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD'
        ).then((res) => res.json())
        .then((complete) => {
            var idLength = complete.suggestions.length
            var dummy
            for (var i = 0; i < idLength; i++){
                dummy = complete.suggestions[i].value
                
                dummyList.push(dummy)
                
            }
            
            
            setCompleteData(dummyList)
            console.log(completeData)
        })

        
    }

    const fetchAutocomplete_NAL = (keyword_) => {
        const dummyList =[]

        return fetch(
            'http://127.0.0.1:5200/autokwd/'+keyword_
        ).then((res) => res.json())
        .then((complete) => {
            var idLength = complete.length
            console.log(idLength)
            console.log(complete)
            var dummy

            for (var i = 0; i < idLength; i++){
                dummy = complete[i].autokwd
                dummyList.push(dummy)
            }

            setNalKwdData(dummyList)
            console.log(nalKwdData)
            
        })
    }



    useEffect(() => {
        
        
        document.documentElement.setAttribute("lang", 'ko');
        document.title = '직비 Alpha Test'
        //해외 직구하기 좋은 날
        
        console.log(keyword)
        const debounce = setTimeout(() => {
            if(keyword) {
                fetchAutocomplete(keyword);
                fetchAutocomplete_NAL(keyword)
            }
            },200)
            return () => {
            clearTimeout(debounce)
        }
        
    }, [keyword])


    let stateData = null
    let crawlState = null
    let crawlstatus = null
    let timer = null
    
    

    let loadInterval = (keyword) => {

        //keyword = filterKeyword(keyword)

        timer = setInterval(() => {
            if (crawlstatus === 200){
                fetch('http://127.0.0.1:5200/goods/'+keyword, {method: 'get'},{headers:{"Content-Type": "application/json"}})
                .then((res_) => res_.json())
                .then((res__) => {
                    stateData = res__

                    stateData.map((item) => {
                        crawlState = item.crawlstate
                    })

                    console.log(crawlState)
                    
                    
                    
                    if (crawlState===false){
                        console.log('수집 완료')
                        
                        nav(`/goods/${keyword}`);
                        stopInterval()

                    }else{console.log('수집 중')}
                })
            }else if (crawlstatus === 404){
                fetch('http://127.0.0.1:5200/goods/'+keyword, {method: 'get'})
                .then((res) =>{
        

                    //console.log(res.status)

        
                    if (res.status === 200){
                        console.log('수집완료')
                        
                        nav(`/goods/${keyword}`);
                        stopInterval()
                    
                    }else if (res.status === 404){
                        
                        console.log(res.status)
                    }else{
                        console.log('crawlerror')
                        stopInterval()
                    }
                })

            }else{
                console.log("Err")
                stopInterval()
            }


        }, 3000)
    }

    function stopInterval(){
        clearInterval(timer)
    }




    const getData = async (keyword_) => {

        

        const ws = new WebSocket("ws://127.0.0.1:1212");
        ws.onopen = () => {
            console.log('연결완료!')
        }

        const message = document.getElementById('textMessage')
        const res = await fetch('http://127.0.0.1:5200/goods/'+keyword_, {method: 'get'})
        
        const resData = await res.json()
        
        const result = ''
        
        console.log(res.status)
        
        
        let data_ = resData
        
        console.log(data_)
       
        


        if (res.status === 404){ 
            ws.send(keyword_)
            console.log('데이터 수집 시작')
            
            setModalIsOpen(true)
            crawlstatus = 404
            loadInterval(keyword_)

        } else if(res.status === 200){
            let sysTime = timeNow()
            let refreshTime = ''
            let diffTime = ''
            
            data_.map((data) => (
                refreshTime = data.refreshtime
        
            ))
            console.log('refreshTime 확인 후 크롤링 시작')
            
            let start = new Date('2022-10-31 '+refreshTime)
            let end = new Date('2022-10-31 '+sysTime)
            

            diffTime = (end.getTime() - start.getTime()) / 1000 / 60
            console.log(Math.abs(diffTime))
            console.log(refreshTime)

            if (Math.abs(diffTime) > 10){
                fetch('http://127.0.0.1:5200/goods/'+keyword_+'?state=true', {method:"PATCH"},{})
                ws.send(keyword_)
                console.log('10분 지나서 크롤링 시작')
                setModalIsOpen(true)
                crawlstatus = 200
                loadInterval(keyword_)
                
                

            } else {
                nav(`/goods/${keyword_}`);
                clearInterval(loadInterval)
            }

        }

        message.value=''
        
    }

    const sendMessage = (keyword_) => {
        
        

        const message = document.getElementById('textMessage').value
        console.log(keyword_)
        console.log(message)

        kwdPost(keyword_)
        if (message == "") {
            console.log('검색어가 없음')
            
        }
        else{
            getData(keyword_)
            console.log(keyword_)
            
        }

        
        
        
    }

    const handleChange = (e) => {

        var inputKeyword = document.getElementById('textMessage').value
        setKeyword(inputKeyword)
        
        
        
            
        
        
        
    }
    const onKeyPress_=(e) => {
        
        const message = document.getElementById('textMessage').value
        if (e.key == 'Enter'){
            sendMessage(message)

            
        }

        
        

    }

    const btnClick = () =>{
        const message = document.getElementById('textMessage').value
        sendMessage(message)
    }



    return(
       
        

            <div className='container'>

                <div className='headerArea'>

                        <span className='headerText'>해외 직구 최저가를 쉽게 찾아보세요!</span>
                        <span className='headerText_'>아직도 일일이 검색하시나요? 검색어 하나만 입력해 한눈에 파악해 보세요!</span>

                </div>

                <div className='searchArea'>

                    <div className='searchRect'>
                        <input id='textMessage' className='searchInput' onKeyPress={onKeyPress_} onChange={handleChange} autoComplete="off" ></input>


                        
                        <a type='button' id='searchBtnInput' className='searchButton' onClick={btnClick}>
                            <FaSearch/>
                        </a>



                    </div>
                    
                    
                </div>

                {keyword.length > 0 && (
                        

                        <div className='autoCompleteArea'>
                            <div className='autoCompleteRect'>
                                {completeData.map((item, index) => {
                                    return(
                                        <ul className='autoCompleteData'>
                                            <li
                                            key ={item}
                                            onClick={() =>{
                                                console.log(item)
                                                sendMessage(item)
                                            }} >
                                                <div>
                                                    {item}
                                                </div>
                                                
                                            </li>
                                        </ul>
                                        
                                    )
                                })}
                                <hr></hr>
                                {nalKwdData.map((item_, index) => {
                                    return(
                                        <ul className='autoCompleteData'>
                                            <li
                                                key={item_}
                                                onClick={() => {
                                                    console.log(item_)
                                                    sendMessage(item_)
                                                }}

                                            >
                                                <div>
                                                    {item_}
                                                </div>

                                            </li>
                                        </ul>
                                    )
                                })}
                            </div>
                        </div>
                    
                    )}

                <Modal isOpen={modalIsOpen}>
                    <div className='modalText'>
                        <p>상품 정보를 수집 중입니다...</p>
                        <p>정보 수집이 1분 이상 걸리면 새로고침 후 다시 검색해 주세요</p>
                    </div>

                </Modal>


                <div className='pathArea'>

                </div>
            </div>
        
    )
}