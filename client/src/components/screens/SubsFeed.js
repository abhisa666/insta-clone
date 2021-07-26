import {useState,useEffect,useContext} from 'react'
import {UserContext} from "../../App"
import {Link} from 'react-router-dom'
import M from 'materialize-css'

function SubsFeed(){

    const {state,dispatch} = useContext(UserContext)
    
    const [data,setData] = useState([])

    useEffect(()=>{

        fetch("http://localhost:5000/getsubpost",{
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })

    },[])

    const likePost = (id) => {
        fetch("http://localhost:5000/like",{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            console.log(result)
        }).catch(err=>{
            console.log(err)
        })
    }
    const unlikePost = (id) => {
        fetch("http://localhost:5000/unlike",{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
            console.log(result)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,id) => {
        fetch("http://localhost:5000/comment",{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    // const deletePost = (postId) => {
    //     fetch(`http://localhost:5000/deletepost/${postId}`,{
    //         method:"delete",
    //         headers:{
    //             "Authorization" : "Bearer "+localStorage.getItem("jwt")
    //         }
    //     }).then(res=>res.json())
    //     .then(result=>{
    //         console.log(result)
    //         const newData = data.filter(item=>{
    //             return item._id !== result._id
    //         })
    //         setData(newData)
    //         M.toast({html:"Post deleted successfully",classes:"#c62828 red darken-3"})
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // }

    return(
        <div style={{maxWidth:"700px",margin:"0px auto"}} className="Home">
            
            {

                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <div style={{display:"flex",justifyContent:"space-between",padding:"10px"}} >
                            <Link to={state._id !== item.postedBy._id?"profile/"+item.postedBy._id:"/profile"}>
                            <div style={{display:"flex",alignItems:"center"}} >
                                <img style={{width:"40px",height:"40px",borderRadius:"50%"}} alt={item.postedBy.name} src={item.postedBy.pic}  />   
                                <h5 style={{margin:"0 10px",cursor:"pointer"}}>{item.postedBy.name}</h5>
                            </div>
                            </Link>
                            </div>
                            <div className="card-image" >
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {
                                    item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons" style={{color:"red",cursor:"pointer"}}
                                        onClick={()=>{unlikePost(item._id)}}
                                    >favorite</i>
                                    :
                                    <i className="material-icons" style={{color:"red",cursor:"pointer"}}
                                        onClick={()=>{likePost(item._id)}}
                                    >favorite_border</i>        
                                }
                            
                                <h6>{item.likes.length} likes </h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span>{"     "+record.text}</h6>
                                        )
                                    })
                                }
                                <form
                                    onSubmit={(e)=>{
                                        e.preventDefault()
                                        makeComment(e.target[0].value,item._id)
                                        e.target[0].value=""
            
                                    }}
                                >
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
                
            }
            

        </div>
    )
}

export default SubsFeed