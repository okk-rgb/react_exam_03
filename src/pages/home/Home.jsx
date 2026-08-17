import React from 'react';
import HeroBanner from '../../components/HeroBanner';
import QuickCategories from '../../components/QuickCategories';
import DealsSection from '../../components/DealsSection';

const Home = ({ add, favorites, toggleFavorite, onOpenUpload, onOpenAuth, user }) => {
  return (
    <div>
      <HeroBanner add={add} onOpenAuth={onOpenAuth} />
      <QuickCategories />
      <DealsSection
        add={add}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        onOpenUpload={onOpenUpload}
        onOpenAuth={onOpenAuth}
        user={user}
      />
    </div>
  );
};

export default Home;
