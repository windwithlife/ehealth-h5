/*
	r_gao 2020/8/22
	个人主页
*/
import React, { Component } from 'react';
import "./index.less";
import LinesEllipsis from 'react-lines-ellipsis'
import { invoke_post, doLogin, isLogin } from "../../common/index";

let sexArr = {
	0: '未知',
	1: '男',
	2: '女'
};

export default class User extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async getUserInfo() {
		await doLogin(location.href);
		let userInfo = await invoke_post('userService/getUserInfo', {}).then((result)=>result?.data);
		// let userInfo = {
		// 	"id": 0,
		// 	"userNickName": '高小锐',
		// 	"userTrueName": '高锐',
		// 	"headPic": 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJkyjDl44oTdicBq30Jz6hlQd5SnHCPAjI57stvMs9RslPX6LAz5xI4vwUjiaX7oFx5nWY81rfViazpA/132',
		// 	"userGrenderWx": 1,
		// 	"provinceId": 0,
		// 	"provinceName": '吉林',
		// 	"cityId": 0,
		// 	"cityName": '吉林',
		// 	"hospitalName": '吉林市四六五医院',
		// 	"departmentName": '神经内科'
		// };
		
		this.setState({
			userInfo: userInfo
		});
	}

	async componentDidMount() {
		try {
			this.getUserInfo();
		} catch (e) {
			console.log('error');
		}
	}

	renderItem(l, r, k) {
		return (
			<div className="user_info_list_item" key={k}>
				<div className="user_info_list_item_left">{l}</div>
				<div className="user_info_list_item_right">{r}</div>
			</div>
		)
	}

	render() {
		let { userInfo = {} } = this.state;

		return (
			<div className="user_container">
				<div className="user_image_container">
					<img className="user_image" src={userInfo.headPic} />
					{
						!!userInfo.userNickName &&	<div className="user_wechat_name">{userInfo.userNickName}</div>
					}
				</div>
				<div className="user_list_spread"></div>
				<div className="user_info_list">
					{this.renderItem('姓名', userInfo.userTrueName, 'userTrueName')}
					{this.renderItem('性别', sexArr[userInfo.userGrenderWx], 'userGrenderWx')}
					{this.renderItem('省份', userInfo.provinceName, 'provinceName')}
					{this.renderItem('城市', userInfo.cityName, 'cityName')}
					{this.renderItem('医院', userInfo.hospitalName, 'hospitalName')}
					{this.renderItem('科室', userInfo.departmentName, 'departmentName')}
				</div>
			</div>
		);
	}
}