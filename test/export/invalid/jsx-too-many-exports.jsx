// Test: JSX with more than 2 exports (should be invalid)
export const Card = ({ title, content }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
    </div>
  )
}

export const CardHeader = ({ title }) => {
  return <h3 className="card-header">{title}</h3>
}

export const CardBody = ({ content }) => {
  return <p className="card-body">{content}</p>
}
