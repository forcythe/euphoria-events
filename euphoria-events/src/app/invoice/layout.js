// Internal tool: keep it out of search results.
export const metadata = {
  title: 'Invoice generator | Euphoria Events',
  robots: { index: false, follow: false },
};

export default function InvoiceLayout({ children }) {
  return children;
}
