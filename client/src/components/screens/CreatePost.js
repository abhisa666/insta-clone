import { useHistory } from "react-router-dom";
import {useState,useEffect} from 'react'
import M from 'materialize-css'

function CreatePost(){

    const history = useHistory()

    const [title,setTitle] = useState('')
    const [body,setBody] = useState('')
    const [image,setImage] = useState('')
    const [imgUrl,setImgUrl] = useState('')
    

    useEffect(()=>{
        
        if(imgUrl){

            // Posting at our server and database
            fetch("http://localhost:5000/createpost",{
                method:"post",
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    imgUrl
                })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html:data.error,classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html:"Post created successfully",classes:"#43a047 green darken-1"})
                    history.push("/")
                }
            })
            .catch(err=>{
                console.log(err)
            })

            
            }

    },[imgUrl])

    const postDetails = () => {
        const data = new FormData()
        data.append('file',image)
        data.append('upload_preset',"insta-clone")
        data.append('cloud_name',"dzcubxzg9")

        // Getting the imh url from Cloudinary
        fetch('https://api.cloudinary.com/v1_1/dzcubxzg9/image/upload',{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setImgUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })

    }

    return(
        <div style={{maxWidth:"700px",margin:"30px auto",padding:"20px",textAlign:"center"}} className="card input-field">
            <input 
                type="text" 
                placeholder="title" 
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
            />
            <input 
                type="text" 
                placeholder="body" 
                value={body}
                onChange={(e)=>{setBody(e.target.value)}}
            />
            <div className="file-field input-field ">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange={e=>{setImage(e.target.files[0])}} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"  />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>{postDetails()}}
            >
                    Create Post
            </button>
        </div>
    )
}

export default CreatePost