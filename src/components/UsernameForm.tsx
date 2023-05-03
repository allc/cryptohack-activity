export default function UsernameForm() {
  return (
    <form>
      <label htmlFor="username">CryptoHack Username</label>
      <input type="text" id="username" required />
      <button type="submit">Show Activities</button>
    </form>
  )
}