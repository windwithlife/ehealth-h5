import React, { useState,useEffect} from 'react';
import "./index.less";
import LinesEllipsis from 'react-lines-ellipsis'
import {invoke_post} from "../../common/index"

/** class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题 */
let totalPage = null;
let currentPage = 1;

function Live(){
  function doClick(item){
    let {id} = item;
    location.href = `${location.origin}/live?id=${id}`;
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
      {liveList.map((item,idx)=>{
        return (
          <div className="live_ele_container" key={idx}>
            <div className="live_ele_left" onClick={()=>doClick(item)}>
              <img src={item.roomPicPath}></img>
              <div className="live_ele_left_desc">
                {item.roomStatus == 0 && `未开始 ${item.liveStartDate}`}
                {item.roomStatus == 1 && "直播中"}
                {item.roomStatus == 2 && "已结束"}
              </div>
            </div>
            <div className="live_ele_right">
              <div className="live_ele_right_ele1">
                <LinesEllipsis text={item.roomTitle} maxLine="2" />
              </div>
              <div className="icon-shipin iconfont">
                &nbsp;{item.playNumber}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default  Live;