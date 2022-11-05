import './goods.css';
import {useState, useEffect} from 'react';
import {FaSearch} from "react-icons/fa";
import Modal from 'react-modal';
import {useParams} from 'react-router-dom';



export function Goods() {

    const params = useParams()
    const [shops, setShops] = useState(null)
    const [statusCode, setStatusCode] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = () => {
        try{
            
            fetch('http://61.73.97.219:5200/goods/'+params.item, {method: 'get'},{headers:{"Content-Type": "application/json"}})

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
                            <h2>{item.keyword}</h2>
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
                                                    <div>
                                                        <a href={item.href}> {item.goodsname}</a>
                                            
                                                    </div>
                                                    <div>{item.price}원</div>
                                                    <div>배송비 {item.deliver}원</div>
                                                    {item.shops.map((item, index) => {
                                                    
                                                        return(
                                                            <div>스토어 {item}</div>
                                                        )
                                                    })}
    
                                                    {item.prices.map((item, index) => {
                                                        return(
                                                            <div>{item}</div>
                                                        )
                                                    })}
    
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
                                                <div>
                                                    <a href={item.href}> {item.goodsname}</a>

                                                </div>
                                                <div>{item.price}원</div>
                                                <div>배송비 {item.deliver}원</div>
                                                {item.shops.map((item, index) => {

                                                    return(
                                                        <div>{item}</div>
                                                    )
                                                })}

                                                {item.prices.map((item, index) => {
                                                    return(
                                                        <div>{item}</div>
                                                    )
                                                })}

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