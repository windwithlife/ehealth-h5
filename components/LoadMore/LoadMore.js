import React from 'react';
import {useEffect,useRef} from "react";
import PropTypes from 'prop-types';
import "intersection-observer";

export default function Lazyload(props){
    const bottomSentryRef = useRef('bottomSentryRef');
   
    useEffect(()=>{
        let observer =  new IntersectionObserver((interSectionObserverEntries)=>{
            let bottomEntry = interSectionObserverEntries[0];
            let {isIntersecting} = bottomEntry;
            if(isIntersecting){
                console.log('----底部守卫----');
                props.callback();
            }
        })
        observer.observe(bottomSentryRef.current);
    },[])

    return (
        <div ref={bottomSentryRef}></div>
    )
}

Lazyload.propTypes = {
    callback: PropTypes.func.isRequired, //触发底部守卫执行回调函数
}
