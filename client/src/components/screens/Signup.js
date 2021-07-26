import {Link,useHistory} from 'react-router-dom'
import {useState,useEffect} from 'react'
import M from 'materialize-css'

function Signup(){

    const history = useHistory()

    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [image,setImage] = useState('')
    const [imgUrl,setImgUrl] = useState(undefined)

    useEffect(()=>{
        if(imgUrl){
            uploadFields()
        }
    },[imgUrl])

    const uploadPic = ()=>{
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

    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("http://localhost:5000/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:imgUrl
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:data.message,classes:"#43a047 green darken-1"})
               history.push('/signin')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
       
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field ">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                />
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                />
                <div className="file-field input-field ">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Profile Picture</span>
                        <input type="file" onChange={e=>{setImage(e.target.files[0])}} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"  />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>PostData()}
                >
                    Signup
                </button>
                <h6>
                    <Link to='/signin'>Alredy have an account? Login</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signup