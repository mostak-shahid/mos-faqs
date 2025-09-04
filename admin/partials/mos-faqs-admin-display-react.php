<?php
// If this file is called directly, abort.
if (!defined('ABSPATH')) die;

?>
<div class="mos-faqs-settings-wrapper">
    <div id="mos-faqs-settings-react-app" class="mos-faqs-settings-react-app">
        <!-- <span><?php echo esc_html__('Loading React App...', 'mos-faqs'); ?></span> -->
        <div class="loading-container">
            <div class="skeleton title"></div>
            <div class="skeleton text"></div>
            <div class="skeleton text"></div>
            <div class="skeleton text" style="width: 60%"></div>
            <div class="skeleton button"></div>
        </div>
        <style>
            .loading-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
        max-width: 600px;
        margin: 50px auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .skeleton {
        background: linear-gradient(
          45deg,
          #e0e0e0 25%,
          #f8f8f8 50%,
          #e0e0e0 75%
        );
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
        border-radius: 4px;
        margin-bottom: 16px;
      }
      .skeleton.title {
        width: 50%;
        height: 24px;
      }
      .skeleton.text {
        width: 80%;
        height: 16px;
      }
      .skeleton.button {
        width: 120px;
        height: 36px;
        margin-top: 20px;
      }
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
        </style>
    </div>
</div>
