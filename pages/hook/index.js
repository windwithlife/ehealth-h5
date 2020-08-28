
import React, { useState} from 'react';

function useCommon(){
    let [count,setCount] = useState(0);
    function doClick(){
        setCount(++count)
    }
    return {
        count,doClick
    }
}

function A(){
    let {doClick,count} = useCommon();
    return (
        <h1 onClick={()=>doClick()}>A_{count}</h1>
    )
}
 
function B(){
    let {doClick,count} = useCommon();

    return (
        <h1 onClick={()=>doClick()}>B_{count}</h1>
    )
}

export default function Index(){
    return (
        <>
            <A></A>
            <B></B>
        </>
    )
}
