import React, {useState, useEffect} from 'react';
import {Card} from '../Component/card';

export const Todopage = () => {

    const [todo, setTodo] = useState([])

    useEffect(() => {
        fetch('/api').then(response => {
            if (response.ok){
                return response.json()
            }
        }).then(data => console.log(data))
    }, [])
    return(
        <>
            <Card />
        </>
    )
}