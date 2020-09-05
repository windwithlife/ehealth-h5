import React from 'react';
import "./index.less";
import InfoAdd from "./InfoAdd"
import {invoke_post} from "../../common/index"
import { Modal } from "antd-mobile";
import {judgeClient} from "../../common/tools";




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
        this.loadPlayer(data); 
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
  androidLivePlay(data){
    try{
      const {pullFlvUrl} = data;
      import("flv.js").then((flvjsData)=>{
        let flvjs = flvjsData.default;
        console.log('Hls.isSupported(): ', flvjs.isSupported(),pullFlvUrl);
        if (flvjs.isSupported()) {
          var videoElement = document.getElementById('videoElement');
          var flvPlayer = flvjs.createPlayer({
            type : "flv",
            url : pullFlvUrl,
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
          flvPlayer.play();
          flvPlayer.on('error',function(error){
            console.error('flv_error: ', error);
          })
        }else{
          Modal.alert('提示', "设备不支持flv流媒体格式", [{text: '确定',onPress: ()=>{}}])
        }
      })
    }catch(error){
      console.error('error: ', error);
    }
  }
  iosLivePlay(data){
    try{
      const {pullHlsUrl} = data;
      import("hls.js").then((hlsData)=>{
        let Hls = hlsData.default;
        console.log('Hls.isSupported(): ', Hls.isSupported(),pullHlsUrl);
        let video = document.getElementById('videoElement');
        let videoSrc = pullHlsUrl;
        if (Hls.isSupported()) {
          let hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
          });
        }else if(video.canPlayType('application/vnd.apple.mpegurl')){
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', function() {
            video.play();
          });
        }else{
          Modal.alert('提示', "设备不支持hls流媒体格式", [{text: '确定',onPress: ()=>{}}])
        }
      }).catch((error)=>{
        console.error('hls——error: ', error);
      })
    }catch(error){
      console.error('error: ', error);
    }
  }
  loadPlayer(data){ 
    console.log('data: ', data);
    const {videoMp4Url,roomStatus,publishStatus} = data;
    if(roomStatus == 1){
      if(judgeClient() == "IOS") this.iosLivePlay(data);
      else this.androidLivePlay(data)
    }else if(roomStatus == 2 && publishStatus == 1){
      let video = document.getElementById('videoElement');
      video.src = videoMp4Url;
    }
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
          {initData.roomStatus==1 && "直播中"}
          {initData.roomStatus==0 && `${initData.liveStartDate} 开播`}
          {initData.roomStatus==2 && initData.playAble == 1 && initData.publishStatus == 0 && "直播结束，回放视频上传中"}
          {initData.roomStatus==2 && (initData.playAble == 0 || initData.publishStatus == 2) && "直播已结束"}
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
        <video id="videoElement"  controls autoPlay>
          Your browser is too old which does not support HTML5 video.
        </video>
        <div className="info_con">
          {info_con_top_module}
          {info_con_bottom_module}
        </div>
        {/* <InfoAdd></InfoAdd> */}
      </div>
    )
  }
}
