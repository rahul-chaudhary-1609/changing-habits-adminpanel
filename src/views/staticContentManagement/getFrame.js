export default function StaticContentFrame(props) {
    return (
         <iframe style={{
                      position: "relative",
                      minHeight: "250px", width: "100%"
                      }}
                      src={props.srcURL} title="Static Content">
                      
                    </iframe>
    )
}