import {Link,useHistory} from 'react-router-dom'
import {useContext,useRef,useEffect,useState} from 'react'
import {UserContext} from '../App'
import M from 'materialize-css'

function Navbar(){

    const searchModal = useRef(null)

    const {state,dispatch} = useContext(UserContext)

    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])

    const history = useHistory()

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('http://localhost:5000/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }

    const renderList = () => {
        if(state){
            return [
                <li key="1" ><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black",marginRight:"20px",cursor:"pointer"}} >search</i></li>,
                <li key="2"><Link to="/profile">{state.name}'s Profile</Link></li>,
                <li key="3"><Link to="/createpost">Create Post</Link></li>,
                <li key="4"><Link to="/subsfeed">My Feed</Link></li>,
                <li key="5">
                    <button onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }} 
                    className="btn #e53935 red darken-1"
                    >
                    Logout
                    </button>
                </li>
            ]
        }
        else{
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Sign Up</Link></li>
            ]
        }
    }

    return(
        <nav>
            <div  className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
            <ul style={{marginRight:"10px"}} id="nav-mobile" className="right">
                {renderList()}
            </ul>
            </div>

            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}} >
                <div className="modal-content">
                <input
                    type="text"
                    placeholder="search users"
                    value={search}
                    onChange={(e)=>{fetchUsers(e.target.value)}}
                />
                <ul className="collection">
                {
                    userDetails.map(item=>{
                        return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                        M.Modal.getInstance(searchModal.current).close()
                        setSearch('')
                        }}><li key={item.id} className="collection-item">{item.email}</li></Link> 
                    })
                }
                </ul>
                </div>
                <div className="modal-footer">
                <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
                </div>

            </div>

        </nav>
    )
}

export default Navbar