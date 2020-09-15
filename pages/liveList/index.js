import React, { useState,useEffect} from 'react';
import "./index.less";
import {invoke_post,doHref} from "../../common/index"


/** class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题 */
let totalPage = null;
let currentPage = 1;

function Live(){
  function doClick(item){
    let {id} = item;
    doHref(`live?id=${id}`);
  }

  const [liveList,setLiveList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try{
        let data = await invoke_post('advertService/getLiveList',{
          currentPage:currentPage,pageSize:10
        }).then((result)=>result?.data);
        totalPage = data?.totalPage || 1;
        
        let liveListData = data?.liveList || [];
        currentPage++;
        setLiveList(liveList.concat(liveListData));
      }catch(error){
        console.error('useEffect_error',error);
      }
    }
    if(!totalPage || currentPage <= totalPage) fetchData();
  },[liveList]);
  


  return(
    <div className="live_list_container">
      {
        liveList.map((item,idx)=>{
          return (
            <div className="ele_con" key={idx} onClick={()=>doClick(item)}>
              <div className="ele_title">{item.roomTitle}</div>
              <div className="ele_desc_con">
                {!!item.playNumber && <div className="play_num iconfont">&#xe768; <span>{item.playNumber}</span></div>} 
                {item.roomStatus == 0} <div className="start_time iconfont">&#xe6be; <span>{item.liveStartDate}</span></div>
              </div>
              <div className="ele_cover_img_con">
                <img className="ele_cover_img"  src={item.roomPicPath}/>
                {(item.roomStatus == 1 || item.roomStatus == 2) && <img className="ele_cover_start_logo" src="http://images.e-healthcare.net/images/2020/09/14/images20091422181879484.png" />} 
                <div style={
                  item.roomStatus==2 ? {background:"#FD5A42"} : item.roomStatus==1 ? {background:"#2BA246"} : {}
                } className="ele_cover_status">
                  {item.roomStatus == 0 && '未开始'}
                  {item.roomStatus == 1 && "直播中"}
                  {item.roomStatus == 2 && "已结束"}
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default  Live;