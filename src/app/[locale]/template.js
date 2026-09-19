// A template re-mounts on every navigation, so the wrapper's entrance plays
// once per route change: the new page fades in and settles 6px upward in
// 240ms. There is no exit phase on purpose; leaving a page must never wait.
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
