const Notification = ({ notification }) => {
    const [status, message] = notification

      return (
        <div className={`notification status-${status}`}>
          {message}
        </div>
      )
}

export default Notification
