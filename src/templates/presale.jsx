import './presale.css'

const Presale = ({ content }) => {
    return (
        <>
            <div className="header">
                <img src="https://i.imgur.com/HzmXVVh.png" alt="Logo" className="logo" />
                <div className="legends">
                    <span style={{ color: "black", display: "flex", alignItems: "center" }}>Legends</span>
                    <span className="features">Features</span>
                    <span className="sub-features">Sub Features</span>
                </div>
            </div>

            <div className="tabs">
                <div className="tab">↳ Pre Sales Features</div>
                <div className="tab2">Feature Description</div>
            </div>

            <div className="content">
                {
                    content.map((item, index) => (
                        <div className="rows" key={index}>
                            <div className="label-dark">{item.title}</div>
                            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                {item.children && item.children.map((child, idx) => (
                                    <RenderTree key={idx} node={child} level={1} />
                                ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

const RenderTree = ({ node, level = 0 }) => {
    return (
        <div style={{ paddingLeft: `${level * 20}px`, marginBottom: "5px" }}>
            <div className="description">{node.title}</div>
            {node.children && node.children.length > 0 && (
                node.children.map((child, index) => (
                    <RenderTree key={index} node={child} level={level + 1} />
                ))
            )}
        </div>
    );
};

export default Presale