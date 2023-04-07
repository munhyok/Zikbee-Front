import './goods.css';
import {useState, useEffect} from 'react';
import {IoMdArrowRoundBack} from "react-icons/io";
import Modal from 'react-modal';
import {useParams, Link, useNavigate} from 'react-router-dom';


const click_back = () => {
    window.history.back()
}


export function Goods() {

    const nav = useNavigate();
    const params = useParams()
    const [shops, setShops] = useState(null)
    const [statusCode, setStatusCode] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = () => {
        try{
            
            var changeItem = params.item

            fetch('http://127.0.0.1:5200/goods/'+changeItem, {method: 'get'},{headers:{"Content-Type": "application/json"}})

            .then((result)=>result.json())
            .then((result)=>setShops(result))

            setLoading(false)



        }catch(error){
            console.error(error)
        }

        
        
    }
    


    useEffect(() => {

        
        fetchData()
        document.documentElement.setAttribute("lang", 'ko');
        document.title = params.item

    }, [])

    
    console.log(shops)
    let list = []
    let idx = 0
    let loop = true
    
   
    
    
    return(
        
        <div>
            
            {shops === null  || shops === undefined ? <p>잠시 기다려주세요</p> :
            shops.map((item, index) =>{
                
                
                
                return(
                    <div className='container'>
                        
                        
                        <div className='header'>
                            <div className='backBtn' onClick={click_back}>
                                
                                    <IoMdArrowRoundBack size={50}/>
                                
                                
                            </div>
                            <div className='itemName'>
                                <h2>{item.keyword}</h2>
                            </div>
                        </div>
                            
                         

                        <div className='warning'>
                            <p className='warnText'>해당 정보는 정확하지 않을 수 있으니 구매 전 가격과 배송비를 확실하게 확인하세요</p>    
                        </div>                        
                    

                        <div className='shopFlex'>
                            <div className='wrap'>
                                <div className='column_'>
                                    <div>
                                        <p className='market'>국내 오픈마켓</p>
                                    </div>
                                    <div>
                                        {item.local.map((item , index) => {
                                            return(
                                                <div className='shopInfo'>
                                                    
                                                    <div>{item.market}</div>

                                                    <div className='productArea'> 

                                                        <div>
                                                            <img className='image_' src={item.img}></img>
                                                        </div>

                                                        <div className='goodsName'>
                                                            <a href={item.href}> {item.goodsname}</a>
                                                            <div>{item.price}원</div>
                                                            <div>배송비 {item.deliver}원</div>
                                                            <div>합산 {item.totalprice}원</div>
                                                        </div>

                                                        <div>
                                                            
                                                        </div>

                                                    </div>
                                                    
                                                    
                                                    
    
                                                </div>
                                            )
                                        })}
                                </div>

                            </div> 

                            <div className='column_'>
                                <div>

                                    <p className='market'>해외 오픈마켓</p>
                                </div>

                                <div>

                                    {item.overseas.map((item, index) => {
                                        return(
                                            
                                            <div className='shopInfo'>
                                                    
                                                    <div>{item.market}</div>

                                                    <div className='productArea'> 

                                                        <div>
                                                            <img className='image_' src={item.img}></img>
                                                        </div>

                                                        <div className='goodsName'>
                                                            <a href={item.href}> {item.goodsname}</a>
                                                            <div>{item.price}원</div>
                                                            <div>배송비 {item.deliver}원</div>
                                                            <div>합산 {item.totalprice}원</div>
                                                        </div>

                                                        <div>
                                                            
                                                        </div>

                                                    </div>
                                                    
                                                    
                                                    
    
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                )
                    
            })}
        </div>
        
    )
}