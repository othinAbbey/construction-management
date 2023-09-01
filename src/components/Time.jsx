function Time() {
  let heading1 = document.getElementById("heading1");

  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = now.getHours();
  const mins = `${now.getMinutes()}`.padStart(2, 0);
  const secs = `${now.getSeconds()}`.padStart(2, 0);
  setTimeout(Time, 1000);
  let date = `${day} / ${month} / ${year} , ${hour}:${mins}:${secs}`;
  //   heading1.textContent = date;
}
Time();

export default Time;
