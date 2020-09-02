import React from 'react';
import "./index.less";
import InfoAdd from "./InfoAdd"
import {invoke_post} from "../../common/index"




export default class Live extends React.Component{
  static async getInitialProps({router}) {
    return { router };
  }
  constructor(props){
    super(props);
    this.state = {
      whichTap:"LEFT", //LEFT | RIGHT
      initData : {}
    }
  }
  async init(){
    try{
      let {query} = this.props.router;
      let data = await invoke_post('advertService/getLiveDetail',{
        id:query?.id
      }).then(result=>result?.data)
      this.setState({initData:data},()=>{
        const {videoMp4Url,roomPicPath} = data;
        this.loadPlayer(videoMp4Url,roomPicPath); 
      })
    }catch(error){
      console.error('error: ', error);
    }
  }
  async componentDidMount(){
    this.init();
  }

  tapClick(whichTap){
    this.setState({whichTap})
  }

  loadPlayer(url,posterUrl){ 
    //xgplayer not support ssr
    import("xgplayer").then((xgplayer)=>{
      const Player = xgplayer.default;
      new Player({
        el:document.querySelector('#mse'),
        // url: url,
        url:"http://liveplayer.koudaibook.com/live/koudaibook_22.flv",
        videoInit: true, //初始化显示视频首帧
        poster: posterUrl //封面图
      });      
    })
  }


  render(){
    const {whichTap,initData} = this.state;

    const info_con_top_module = (
      <div className="info_con_top">
        <div className="info_con_title">
          {initData.roomTitle}
        </div>
        <div className="icon-shipin iconfont">
          &nbsp;{initData.playNumber}
        </div>
        <div>
          {initData.roomStatus && "直播中"}
          {initData.roomStatus && `${initData.liveStartDate} 开播`}
          {initData.roomStatus=2 && initData.playNumber ==0 && "待回看"}
          {initData.roomStatus=2 && initData.playNumber ==1 && "回看视频上传中"}
        </div>
      </div>
    )
    let info_con_bottom_module = null;
    if(Object.keys(initData).length){
      info_con_bottom_module = (
        <div className="info_con_bottom">
          <>
            <div onClick={this.tapClick.bind(this,"LEFT")}
              style={whichTap=="LEFT"?{background:"#108ee9",color:"#fff"}:{}} 
              className="info_con_bottom_left_tap tap">
              会议日程
            </div>
            <div  onClick={this.tapClick.bind(this,"RIGHT")}
            style={whichTap=="RIGHT"?{background:"#108ee9",color:"#fff"}:{}}
            className="info_con_bottom_right_tap tap">
              会议介绍
            </div>
            <img className="desc_img" src={
              whichTap == "LEFT" ? initData.roomSchedulePath : initData.roomDescPath
            } />
          </>
        </div>
      )
    }

    return (
      <div className="live_container">
        <div id="mse"></div>

        <div className="info_con">
          {info_con_top_module}
          {info_con_bottom_module}
        </div>
        {/* <InfoAdd></InfoAdd> */}
      </div>
    )
  }
}
