<template>
    <div class="login-wrapper">
        <div class="login-container">
            <div class="login-left">
                <div class="logo">
                    <img src="/vite.svg" />
                    <p>Front Monitor</p>
                </div>
                <img src="@\assets\login-box-bg.svg">

            </div>
            <div class="login-right">
                <Transition mode="out-in">
                    <loginForm v-if="store.model === 'login'"></loginForm>
                    <mobileForm v-else-if="store.model === 'moblie'"></mobileForm>
                    <registerForm v-else></registerForm>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import loginForm from "./loginForm.vue"
import mobileForm from "./mobileForm.vue"
import registerForm from "./registerForm.vue"
import { mainStore } from "@/stores/index";

const store = mainStore()


</script>

<style lang="scss" scoped>
.login-wrapper {
    width: 100%;
    height: 100%;

    &::before {
        content: '';
        background-image: url(@/assets/login-bg.svg);
        position: absolute;
        width: 100%;
        height: 100%;
        margin-left: -48%;
        background-position: 100%;
        background-repeat: no-repeat;
        background-size: auto 100%;
        z-index: -999;
    }

    .login-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 5%;
        padding: 0 2.5rem;
        height: 100vh;

        .login-left {
            display: flex;
            flex-direction: column;
            width: 50%;
            padding-left: 5%;

            .logo {
                display: flex;
                margin-bottom: 4%;
                padding-left: 7%;
                font-weight: 700;
                font-size: 24px;
                color: #fff;

                img {
                    width: 8%;
                }

                p {
                    margin-left: 1%;
                    padding-top: 1%;
                }
            }

            img {
                width: 50%;
            }
        }

        .login-right {
            margin-right: 10%;
            width: 30%;
        }
    }
}
.v-enter-active {
  transition: all 0.8s ease-out;
}

.v-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>