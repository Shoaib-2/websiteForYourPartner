export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush-100 to-cream">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-charcoal">404 - Page Not Found</h1>
        <p className="text-charcoal-light mb-6">Oops! The page you're looking for doesn't exist.</p>
        <a
          href="/valentine-week-journey/"
          className="inline-block bg-gradient-to-r from-coral to-rose-gold text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
        >
          Return to Journey
        </a>
      </div>
    </div>
  );
}