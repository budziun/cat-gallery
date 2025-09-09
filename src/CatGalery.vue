<template>
  <div class="cat-gallery">
    <div class="gallery-header">
      <h1>🐱 Cat Gallery - by budziun</h1>

      <!-- Formularz do zmian liczby -->
      <div class="controls">
        <div class="cat-count-form">
          <label for="catCount">Number of cats:</label>
          <div class="input-container">
            <input
                id="catCount"
                type="range"
                v-model.number="catCount"
                min="6"
                max="10"
                @input="onCatCountChange"
                :disabled="isLoading"
                class="cat-count-slider"
            />
            <div class="count-display">{{ catCount }}</div>
          </div>
        </div>

        <button
            @click="refreshCats"
            :disabled="isLoading"
            class="refresh-btn"
        >
          <span v-if="!isLoading">🔄 Refresh cats</span>
          <span v-else>Loading...</span>
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="isLoading && cats.length === 0" />

    <div v-if="error" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="refreshCats" class="retry-btn">Try again</button>
    </div>


    <div
        class="gallery-grid"
        :class="{ loading: isLoading && cats.length > 0 }"
    >
      <div
          v-for="(cat, index) in cats"
          :key="cat.id"
          class="cat-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="openModal(cat.url)"
      >
        <img
            :src="cat.url"
            :alt="`Cat ${index + 1}`"
            class="cat-image"
            @load="onImageLoad"
        />
        <div class="cat-card-overlay">
          <span>Click to view</span>
        </div>
      </div>
    </div>

    <CatModal
        :is-visible="modalVisible"
        :image-url="selectedImageUrl"
        @close="closeModal"
    />
  </div>
</template>

<script>
import { CatService } from './service/CatService.js'
import CatModal from './CatModal.vue'
import LoadingSpinner from './Loading.vue'

export default {
  name: 'CatGallery',
  components: {
    CatModal,
    LoadingSpinner
  },
  data() {
    return {
      cats: [],
      isLoading: false,
      error: null,
      modalVisible: false,
      selectedImageUrl: '',
      loadedImages: 0,
      catCount: 6
    }
  },
  async mounted() {
    await this.loadCats();
  },
  methods: {
    async loadCats() {
      this.isLoading = true;
      this.error = null;
      this.loadedImages = 0;


      try {
        const catsData = await CatService.fetchCats(this.catCount);
        this.cats = catsData;
      } catch (error) {
        this.error = 'Failed to load cats. Please try again.';
        console.error('Error loading cats:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async refreshCats() {
      await this.loadCats();
    },

    async onCatCountChange() {
      // Walidacja wartości
      if (this.catCount < 6) {
        this.catCount = 6;
      } else if (this.catCount > 10) {
        this.catCount = 10;
      }

      // Automatyczne odswiezanie po zmianie liczby
      await this.loadCats();
    },

    openModal(imageUrl) {
      this.selectedImageUrl = imageUrl;
      this.modalVisible = true;
    },

    closeModal() {
      this.modalVisible = false;
      this.selectedImageUrl = '';
    },

    onImageLoad() {
      this.loadedImages++;
    }
  }
}
</script>

<style scoped>
.cat-gallery {
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.gallery-header {
  width: 100%;
  max-width: 1400px;
  margin-bottom: 2rem;
}

.gallery-header h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.2;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
}

.cat-count-form {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.cat-count-form label {
  font-weight: 600;
  color: #555;
  white-space: nowrap;
  font-size: 0.9rem;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.cat-count-slider {
  width: 100px;
  height: 6px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  transition: all 0.3s ease;
}

.cat-count-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cat-count-slider::-webkit-slider-thumb:hover {
  background: #ff5252;
  transform: scale(1.1);
}

.cat-count-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6b6b;
  cursor: pointer;
  border: none;
}

.cat-count-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.count-display {
  background: #ff6b6b;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 600;
  min-width: 35px;
  text-align: center;
  font-size: 1rem;
}

.count-info {
  font-size: 0.8rem;
  color: #888;
}

.refresh-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  white-space: nowrap;
  width: 100%;
  max-width: 200px;
  text-align: center;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.gallery-grid {
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  min-height: 300px;
  padding: 0 1rem;
  box-sizing: border-box;
}

.gallery-grid.loading {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.cat-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
  width: 100%;
}

.cat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cat-card:hover .cat-image {
  transform: scale(1.05);
}

.cat-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cat-card:hover .cat-card-overlay {
  opacity: 1;
}

.error-message {
  width: 100%;
  max-width: 1400px;
  text-align: center;
  padding: 1.5rem;
  background-color: #ffe6e6;
  border-radius: 8px;
  margin: 1rem 0;
}

.error-message p {
  color: #d32f2f;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background-color: #ff5252;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .cat-gallery {
    padding: 0.5rem;
  }

  .gallery-header h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .cat-count-form {
    padding: 1rem;
    gap: 0.8rem;
    max-width: none;
    justify-content: space-between;
  }

  .input-container {
    gap: 0.8rem;
  }

  .cat-count-slider {
    width: 80px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    padding: 0 0.5rem;
  }

  .cat-card-overlay {
    font-size: 0.9rem;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .cat-gallery {
    padding: 0.25rem;
  }

  .gallery-header h1 {
    font-size: 1.5rem;
    padding: 0 0.5rem;
  }

  .cat-count-form {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1rem 0.5rem;
  }

  .input-container {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .cat-count-slider {
    width: 150px;
  }

  .refresh-btn {
    max-width: 300px;
    padding: 12px 24px;
    font-size: 1rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding: 0 0.25rem;
    margin-top: 0.5rem;
  }

  .cat-card {
    border-radius: 8px;
  }

  .cat-card-overlay {
    font-size: 0.8rem;
  }
}

/* Very small screens */
@media (max-width: 350px) {
  .gallery-header h1 {
    font-size: 1.3rem;
  }

  .cat-count-form label {
    font-size: 0.8rem;
  }

  .count-display {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
  }

  .count-info {
    font-size: 0.7rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
