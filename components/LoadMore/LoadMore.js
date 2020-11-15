import React from 'react';
import {useEffect,useRef} from "react";
import PropTypes from 'prop-types';
import "intersection-observer";

export default class  Lazyload extends React.Component{
    constructor(props){
        super(props);
        this.bottomSentryRef = React.createRef();
    }
    componentDidMount(){
        let observer =  new IntersectionObserver((interSectionObserverEntries)=>{
            let bottomEntry = interSectionObserverEntries[0];
            let {isIntersecting} = bottomEntry;
            if(isIntersecting){
                console.log('----loayload--底部守卫----');
                this.props.callback();
            }
        })
        observer.observe(this.bottomSentryRef.current);
    }
    render(){
        return (
            <div ref={ this.bottomSentryRef}></div>
        )
    }

}

Lazyload.propTypes = {
    callback: PropTypes.func.isRequired, //触发底部守卫执行回调函数
}
