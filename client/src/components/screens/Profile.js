import {useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

function Profile(){

    const {state,dispatch} = useContext(UserContext)

    const [mypics,setPics] = useState([])

    const [image,setImage] = useState('')  

    useEffect(()=>{
        fetch("http://localhost:5000/mypost",{
            headers:{
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setPics(result.mypost)
        })
    },[])

    useEffect(()=>{
        if(image){

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

                fetch('http://localhost:5000/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                })
                .then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})

                })
                
                
            })
            .catch(err=>{
                console.log(err)
            })

        }
    },[image])

    const updatePhoto = (file) => {
        setImage(file)
        const dp = document.getElementById("dp-picker")
        dp.classList.toggle('hide-update-dp')
    }

    return(
        <div style={{maxWidth:"700px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>

                    <img style={{width:"160px",height:"160px",borderRadius:"50%",cursor:"pointer"}}
                        src={state?state.pic:"loading"} 
                        onClick={()=>{
                            const dp = document.getElementById("dp-picker")
                            dp.classList.toggle('hide-update-dp')
                        }}
                        
                        />

                    <div style={{transform:"scale(0.9)"}} id="dp-picker" className="file-field input-field hide-update-dp ">
                        <div   className="btn #64b5f6 blue darken-1">
                            <span>upload dp</span>
                            <input type="file" 
                                onChange={(e)=>{updatePhoto(e.target.files[0])}}
                            />
                        </div>
                        <div  className="file-path-wrapper">
                            <input className="file-path validate" type="text"  />
                        </div>
                    </div>

                    

                </div>
                <div>
                    <h4>{state?state.name:"Loading"}</h4>
                    <h5>{state?state.email:"Loading"}</h5>
                    <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"110%"
                    }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                    </div>
                </div>
            </div>
        
            <div className="gallery">
                {
                    mypics.map(pic=>{
                        return(
                        <img key={pic._id} className="item" src={pic.photo} alt={pic.title} />
                        )
                    })
                }
            </div>
        
        </div>
    )
}

export default Profile