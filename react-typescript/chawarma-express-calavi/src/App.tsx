import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { CartProvider } from './cart/CartContext.tsx';
import { Layout } from './components/Layout.tsx';
import { Home } from './pages/Home.tsx';

// Pages chargées à la demande : la première visite (accueil) télécharge moins de code.
const Menu = lazy(() => import('./pages/Menu.tsx').then((m) => ({ default: m.Menu })));
const Order = lazy(() => import('./pages/Order.tsx').then((m) => ({ default: m.Order })));
const Reservation = lazy(() => import('./pages/Reservation.tsx').then((m) => ({ default: m.Reservation })));
const About = lazy(() => import('./pages/About.tsx').then((m) => ({ default: m.About })));
const Legal = lazy(() => import('./pages/Simple.tsx').then((m) => ({ default: m.Legal })));
const NotFound = lazy(() => import('./pages/Simple.tsx').then((m) => ({ default: m.NotFound })));

const page = (content: ReactNode, waFloat = true) => <Layout waFloat={waFloat}><Suspense fallback={null}>{content}</Suspense></Layout>;

/** Pages du site (mêmes contenus que la version HTML ; adresses sans « .html »). */
export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={page(<Home />)} />
          <Route path="/menu" element={page(<Menu />)} />
          <Route path="/commander" element={page(<Order />, false)} />
          <Route path="/reservation" element={page(<Reservation />, false)} />
          <Route path="/a-propos" element={page(<About />)} />
          <Route path="/mentions-legales" element={page(<Legal />)} />
          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
