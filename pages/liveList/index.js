import React, { useState,useEffect} from 'react';
import "./index.less";
import {invoke_post,doHref} from "../../common/index";
import {LoadMore} from "components";


/** class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题 */
let totalPage = null;
let currentPage = 1;

function Live(props){
  const [liveList,setLiveList] = useState([]);
 

  function __doClick(item){
    let {id} = item;
    doHref(`live?id=${id}`);
  }
  
  async function __loadData(){
    try{
      if(!totalPage || currentPage<=totalPage) {
        let data = await invoke_post('advertService/getLiveList',{
          currentPage:currentPage,pageSize:10
        }).then((result)=>result?.data);
        totalPage = data?.totalPage || 1;
        let liveListData = data?.liveList || [];
        currentPage++;
        setLiveList(liveList.concat(liveListData));
      }else{
        console.log('props.NODE_ENV: ', props.NODE_ENV);
        console.log(`数据加载完成 totalPage = ${totalPage} , currentPage = ${currentPage}`);
      }
    }catch(error){
      console.error('__loadData_error',error);
    }
  }


  


  return(
    <div className="live_list_container">
      {
        liveList.map((item,idx)=>{
          return (
            <div className="ele_con" key={idx} onClick={()=>__doClick(item)}>
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
      <LoadMore callback={__loadData}></LoadMore>

    </div>
  )
}

export default  Live;