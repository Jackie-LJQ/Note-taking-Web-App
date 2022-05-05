import './post.css'

export default function Post() {
  return (
    <div className="post">
        <div className="postInfo">
            <div className="postTags">
                <span className="postTag">General</span>
            </div>
            <span className="postTitle">Lorem</span>
            <hr/>
            <span className="postDate">1 hour ago</span>
        </div>
        <p className="postAbs">
            Lorem
        </p>
    </div>
  )
}
