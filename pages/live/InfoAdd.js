import React, { useState,useEffect} from 'react';
import { List, InputItem, WhiteSpace,Picker,Modal } from 'antd-mobile';
import "./infoAdd.less";
import {invoke_post,doLogin,isLogin} from "../../common/index"


class CustomChildren extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    const props = this.props;
    props.setPickChineseVal(props.extra)
    return(
      <div onClick={props.onClick} style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
        <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px',position:'relative',borderBottom:0 }}>
            <div style={{ width:"45px", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',fontSize:"17px" }}>{props.children}</div>
            <div style={{ textAlign: 'left', color: '#888', marginRight: 15,fontSize:"17px" }}>{props.extra}</div>
        </div>
      </div>
    )
  }
}



export default class InfoAdd extends React.Component{
  constructor(props){
    super(props);
    this.name = "";
    this.hospital = "";
    this.department = "";
    this.pickChineseVal  = '';
    this.state = {
      pickerValue:null,
      isShowinfoAddModule:false,
    }
  }
  setPickChineseVal(pickChineseVal){
    console.log('pickChineseVal: ', pickChineseVal);
    this.pickChineseVal = pickChineseVal;
  }

  onChange(type,val){
    switch(type){
      case "NAME" : {
        this.name = val;
      }
      break;
      case "HOSPITAL" : {
        this.hospital = val;
      }
      break;
      case "DEPARTMENT" : {
        this.department = val;
      }
      break;
    }
  }
  onOk(value){
    console.log('value: ', value);
    this.setState({ pickerValue: value })
  }

  async doClick(){
    try{
      let {name,department,hospital,pickChineseVal} = this;
      console.log('name,department,hospital,pickChineseVal: ', name,department,hospital,pickChineseVal);
      // let {pickerValue} = this.state;
      if(!name || !department || !hospital || !pickChineseVal || pickChineseVal=="请选择") {
        Modal.alert('提示', "信息填写不完整", [{text: '确定',onPress: ()=>{}}])
        return;
      }

      let [provinceName,cityName] = pickChineseVal.split(',')
      await invoke_post('userService/updateUserInfo',{
        userTrueName:name,
        provinceName,cityName,
        hospitalName:hospital,
        departmentName:department,
      }).then(res=>res.data);
      this.setState({ isShowinfoAddModule:false})
    }catch(error){
      console.error('error: ', error);
    }
  }

  async componentDidMount(){
    try{
      let isLoginFlag = await isLogin();
      if(!isLoginFlag){
        await doLogin(location.href);
      }
      let data = await invoke_post('userService/validateWriteUserInfo').then(res=>res.data);
      let {isWrite} = data;  //0未填写 1已填写
      if(isWrite == 0) this.setState({ isShowinfoAddModule:true});
    }catch(error){
      console.error('componentDidMount_error',error);
    }
  }

  render(){
    const {isShowinfoAddModule} = this.state;
    let antdDistrict =[];
    let districtData = require('./location');
    Object.keys(districtData).forEach((index)=>{
        let itemLevel1 ={};
        let itemLevel2 ={};
        itemLevel1.value = districtData[index].code;
        itemLevel1.label = districtData[index].name;
        itemLevel1.children = [];
        let data = districtData[index].cities;
        Object.keys(data).forEach((index)=>{
            itemLevel2.value = data[index].code;
            itemLevel2.label = data[index].name;
            itemLevel2.children = [];
            let data2 = data[index].districts;
            let itemLevel3 ={};
            itemLevel3.children = [];
            Object.keys(data2).forEach((index)=>{
                itemLevel3.value = index;
                itemLevel3.label = data2[index];
                itemLevel2.children.push(itemLevel3);
                itemLevel3 ={};
            });
            itemLevel1.children.push(itemLevel2);
            itemLevel2 ={};
        });
        antdDistrict.push(itemLevel1)
    });

    const info_add_module = (
      <div className="info_add_layer_con">
        <div className="info_add_layer_content_con">
          <div className="info_add_layer_content_title">个人信息填写</div>
          <div className="info_con_bottom_content">
            <InputItem onChange={this.onChange.bind(this,"NAME")} clear >姓名</InputItem>
            <InputItem onChange={this.onChange.bind(this,"HOSPITAL")} clear >医院</InputItem>
            <InputItem onChange={this.onChange.bind(this,"DEPARTMENT")} clear >科室</InputItem>
            <Picker title="选择地区" extra="请选择" data={antdDistrict} 
                    value={this.state.pickerValue} 
                    onOk={this.onOk.bind(this)}
                >
                    <CustomChildren setPickChineseVal={this.setPickChineseVal.bind(this)}>省份</CustomChildren>
                </Picker>
            <div className="submit" onClick={this.doClick.bind(this)}>提交</div>
          </div>
        </div>
      </div>
    )
    return (
      <>
        {isShowinfoAddModule && info_add_module}
      </>
    )
  }
}
