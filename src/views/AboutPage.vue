<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>

<AppHeader />

<div class="max-w-5xl mx-auto px-4 py-8 text-justify">
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6 items-start">
    <div class="hidden lg:block">
      <img src="/simon.jpg" alt="Simon" class="w-full rounded-lg shadow-md">
    </div>
    <div class="lg:col-span-3 text-gray-700 space-y-6">
      <p>
        Hello, moi c'est Simon 😊 J’ai grandi dans le Jura, avec des grands-parents qui m’emmenaient crapahuter dès que l’occasion se présentait. 
        30 ans plus tard je suis toujours aussi sensible à la beauté des nuits de bivouac face au massif du Mont-Blanc, et à celle des cartes IGN.
      </p>
      <p>
        Je suis ingénieur de formation et donc passionné de cartographie. Mon objectif est de conduire des projets qui cherchent à mettre en avant la donnée géographique, principalement par la conception d’applications web.
      </p>
      <p>
        Kavalé est une application web ayant pour objectif de valoriser la cartographie des sentiers de randonnées en France. Les premières données mises en ligne concernent l'île de la Réunion, d'autres zones arriveront prochainement.
      </p>
    </div>
  </div>

  <div class="my-12 border-t pt-8 space-y-8">
    <section>
      <h2 class="text-xl font-semibold mb-2">Édition et contact</h2>
      <p class="text-gray-600">Simon BAILLY - <a href="mailto:simon.bailly5@gmail.com" class="text-blue-600 hover:underline">simon.bailly5@gmail.com</a></p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Hébergement</h2>
      <ul class="list-disc list-inside text-gray-600 space-y-1">
        <li>Firebase Hosting par Google</li>
        <li>1600 Amphitheatre Parkway – Mountain View, CA 94043, USA</li>
        <li><a href="https://firebase.google.com/support/troubleshooter/contact" class="text-blue-600 hover:underline">Contact</a></li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Droits d'auteur</h2>
      <p class="text-gray-600">
        L'application Kavalé est distribuée sous une licence open-source 
        <a href="https://www.gnu.org/licenses/gpl-3.0.html" class="text-blue-600 hover:underline">GNU General Public License v3.0</a>. 
        Le code source est en accès libre sur 
        <a href="https://github.com/baillysi/" class="text-blue-600 hover:underline">GitHub</a>.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
      <p class="text-gray-600">
        Le nom de domaine, les photos et les tracés GPX sont la propriété exclusive de l'éditeur. 
        L'éditeur possède également les droits de reproduction et de représentation du logo Kavalé et de l'illustration de la Barre des Écrins.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Conditions d'utilisation et responsabilité</h2>
      <p class="text-gray-600">
        L'éditeur ne pourra être tenu responsable de l'utilisation des informations proposées via l'application. 
        En particulier, l'éditeur ne pourra être tenu pour responsable d'un incident ou accident survenu lors d'une randonnée figurant parmi la liste des sorties proposées.
        La montagne est un milieu à risque, veillez à vous renseigner sur l'état des sentiers et la météo avant de vous engager.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Utilisation des données personnelles</h2>
      <p class="text-gray-600">
        L'utilisateur n'est pas tenu de communiquer des données personnelles lors de l'utilisation de l'application. 
        S'il le souhaite, il peut s'authentifier via les fournisseurs proposés (Google et GitHub) pour accéder à des fonctionnalités avancées. 
        L'application accède dès lors à son adresse email. L'éditeur s'engage à protéger cette donnée et à ne pas la céder à des tiers, et à la supprimer après un an d'inactivité.
      </p>
      <p class="text-gray-600 mt-4">
        L'hébergeur de l'application s'engage également sur la protection des données personnelles : 
        <a href="https://firebase.google.com/support/privacy?hl=fr" class="text-blue-600 hover:underline">confidentialité et sécurité dans Firebase</a>.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-2">Préférences relatives aux cookies</h2>
      <p class="text-gray-600">
        Un cookie est un traceur permettant d’analyser le comportement des internautes, comme leurs navigations, leurs habitudes de consommation, leurs déplacements, etc.
        L'application Kavalé utilise des cookies pour permettre l'authentification de l'utilisateur si celui-ci le souhaite.
      </p>
    </section>
  </div>

</div>

<AppFooter />

</template>
