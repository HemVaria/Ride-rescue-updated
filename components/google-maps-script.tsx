/**
 * Server Component that injects the Google Maps JavaScript API.
 * Place this once in your layout (e.g. app/layout.tsx) **above** any client
 * components that rely on Google Maps.
 *
 *  import GoogleMapsScript from "@/components/google-maps-script";
 *  ...
 *  <html>
 *    <head>
 *      <GoogleMapsScript />  // <- HERE
 *    </head>
 *    ...
 *  </html>
 *
 * The Maps key is read on the server so it is not bundled into the client JS.
 */

export default function GoogleMapsScript() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    // Render nothing if the key is not set – the app will fall back to OSM
    return null
  }

  return (
    <script
      key="google-maps-script"
      src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`}
      async
      defer
      crossOrigin="anonymous"
    />
  )
}
