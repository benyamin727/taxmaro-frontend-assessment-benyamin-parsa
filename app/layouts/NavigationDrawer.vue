<template>
  <v-navigation-drawer>
    <v-list nav>
      <v-list-item title="Home" link to="/" />
      <v-list-item
        title="Personal Data"
        link
        :to="{ path: '/personal-data/personal' }"
      />
    </v-list>
  </v-navigation-drawer>
</template>
