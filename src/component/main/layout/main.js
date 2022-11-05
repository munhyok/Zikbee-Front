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



export function Main() {

    

    const nav = useNavigate();
    const [data, setData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [crawlstate_, setCrawlstate] = useState(false);
    const ws = new WebSocket("ws://61.73.97.219:1212")
    
    

    useEffect(() => {
        
        ws.onopen = () => {
            console.log('연결완료!')
        }
        document.documentElement.setAttribute("lang", 'ko');
        document.title = 'Closed Alpha Test'
        //해외 직구하기 좋은 날
    })


    let stateData = null
    let crawlState = null
    let crawlstatus = null
    let timer = null
    
    

    let loadInterval = (keyword) => {
        timer = setInterval(() => {
            if (crawlstatus === 200){
                fetch('http://61.73.97.219:5200/goods/'+keyword, {method: 'get'},{headers:{"Content-Type": "application/json"}})
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
                fetch('http://61.73.97.219:5200/goods/'+keyword, {method: 'get'})
                .then((res) =>{
        

                    console.log(res.status)

        
                    if (res.status === 200){
                        console.log('수집완료')
                        
                        nav(`/goods/${keyword}`);
                        stopInterval()
                    
                    }else if (res.status === 404){
                        console.log('수집 중')
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




    const getData = async (keyword) => {

        const message = document.getElementById('textMessage')
        const res = await fetch('http://61.73.97.219:5200/goods/'+keyword, {method: 'get'})
        
        const resData = await res.json()
        
        const result = ''
        
        console.log(res.status)
        
        
        let data_ = resData
        
        console.log(data_)
       
        


        if (res.status === 404){ 
            ws.send(message.value)
            console.log('데이터 수집 시작')
            
            setModalIsOpen(true)
            crawlstatus = 404
            loadInterval(keyword)

        } else if(res.status === 200){
            let sysTime = timeNow()
            let refreshTime = ''
            let diffTime = ''
            let keyword_ = ''
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
                fetch('http://61.73.97.219:5200/goods/'+keyword+'?state=true', {method:"PATCH"},{})
                ws.send(message.value)
                console.log('10분 지나서 크롤링 시작')
                setModalIsOpen(true)
                crawlstatus = 200
                loadInterval(keyword)
                
                

            } else {
                nav(`/goods/${keyword}`);
                clearInterval(loadInterval)
            }

        }

        message.value=''
        
    }

    const sendMessage = () => {


        const message = document.getElementById('textMessage')
        let httpStatus = ''
        if (message.value == "") {
            console.log('검색어가 없음')
            
        }
        else{
            getData(message.value)
            
        }

        
        
        
    }

    const onKeyPress=(e) => {
        
        if (e.key == 'Enter'){
            sendMessage()
        }

        
        

    }

    return(
       
        

            <div className='container'>

                <div className='headerArea'>

                        <span className='headerText'>해외 직구 최저가를 쉽게 찾아보세요!</span>
                        <span className='headerText_'>아직도 일일이 검색하시나요? 검색어 하나만 입력해 한눈에 파악해 보세요!</span>

                </div>

                <div className='searchArea'>

                    <div className='searchRect'>
                        <input id='textMessage' className='searchInput' onKeyDown={onKeyPress}></input>



                        <a type='button' id='searchBtnInput' className='searchButton' onClick={sendMessage}>
                            <FaSearch/>
                        </a>



                    </div>
                </div>

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