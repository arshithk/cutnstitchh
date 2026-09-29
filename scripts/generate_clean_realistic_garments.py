import os
import cv2
import numpy as np
import scipy.ndimage as ndi

BRAIN = r"C:/Users/arshu/.gemini/antigravity-ide/brain/bde53ba5-96b5-48e3-a6a7-c1a2fa5a1654"
OUT = r"C:/cutnstitch copy/CutnStitch/public/images"

def get_garment_mask(name, w_img, r_img):
    diff = np.max(np.abs(w_img.astype(float) - r_img.astype(float)), axis=2)
    mask = (diff > 28).astype(np.uint8)
    
    if name == "polo":
        mask[:228, :] = 0
        mask[683:, :] = 0
        mask[:, :275] = 0
        mask[:, 630:] = 0
    elif name == "sweat":
        mask[:228, :] = 0
        mask[683:, :] = 0
        mask[:, :265] = 0
        mask[:, 635:] = 0
    elif name == "hoodie":
        mask[:190, :] = 0
        mask[704:, :] = 0
        mask[:, :260] = 0
        mask[:, 640:] = 0
        
    mask = ndi.binary_fill_holes(mask).astype(np.uint8) * 255
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    if n > 1:
        largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        mask = (labels == largest).astype(np.uint8) * 255
        
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, k)
    mask = ndi.binary_fill_holes(mask > 0).astype(np.uint8) * 255
    return mask

def generate_garment_colors(name, w_file, r_file, out_prefix):
    w_img = cv2.imread(os.path.join(BRAIN, w_file))
    r_img = cv2.imread(os.path.join(BRAIN, r_file))
    
    # 1. White is exact studio photo
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-white.jpg"), w_img, [cv2.IMWRITE_JPEG_QUALITY, 95])
    # 2. Red is exact studio photo
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-red.jpg"), r_img, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    mask = get_garment_mask(name, w_img, r_img)
    
    # Mask edge feathering & red fringe neutralization
    k_dilate = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(mask, k_dilate, iterations=1)
    alpha = cv2.GaussianBlur(dilated.astype(float) / 255.0, (3, 3), 0.8)
    alpha_3d = np.repeat(alpha[:, :, np.newaxis], 3, axis=2)
    
    # Neutral monochrome base from red photo
    lab_r = cv2.cvtColor(r_img, cv2.COLOR_BGR2LAB).astype(float)
    L_r, A_r, B_r = cv2.split(lab_r)
    A_neutral = np.where(dilated > 0, 128.0, A_r)
    B_neutral = np.where(dilated > 0, 128.0, B_r)
    
    # 3. Black: Photographic gamma curve
    L_black = np.clip((L_r / 255.0)**1.3 * 55.0 + 8.0, 0, 255)
    black_bgr = cv2.cvtColor(cv2.merge([L_black.astype(np.uint8), A_neutral.astype(np.uint8), B_neutral.astype(np.uint8)]), cv2.COLOR_LAB2BGR)
    final_black = (black_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-black.jpg"), final_black, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 4. Grey: Smoothly darkened luminance from the white studio photo
    lab_w = cv2.cvtColor(w_img, cv2.COLOR_BGR2LAB).astype(float)
    L_w, A_w, B_w = cv2.split(lab_w)
    L_grey = np.clip(L_w * 0.60, 0, 255)
    A_w_neutral = np.where(dilated > 0, 128.0, A_w)
    B_w_neutral = np.where(dilated > 0, 128.0, B_w)
    grey_bgr = cv2.cvtColor(cv2.merge([L_grey.astype(np.uint8), A_w_neutral.astype(np.uint8), B_w_neutral.astype(np.uint8)]), cv2.COLOR_LAB2BGR)
    final_grey = (grey_bgr.astype(float) * alpha_3d + w_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-grey.jpg"), final_grey, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 5. Navy Blue
    L_navy = np.clip(L_r * 0.45, 0, 255)
    A_navy = np.where(dilated > 0, 132.0, A_r)
    B_navy = np.where(dilated > 0, 85.0, B_r)
    navy_bgr = cv2.cvtColor(cv2.merge([L_navy.astype(np.uint8), A_navy.astype(np.uint8), B_navy.astype(np.uint8)]), cv2.COLOR_LAB2BGR)
    final_navy = (navy_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-navy-blue.jpg"), final_navy, [cv2.IMWRITE_JPEG_QUALITY, 95])
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-dark-blue.jpg"), final_navy, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 6. Royal Blue
    L_royal = np.clip(L_r * 0.58, 0, 255)
    A_royal = np.where(dilated > 0, 135.0, A_r)
    B_royal = np.where(dilated > 0, 75.0, B_r)
    royal_bgr = cv2.cvtColor(cv2.merge([L_royal.astype(np.uint8), A_royal.astype(np.uint8), B_royal.astype(np.uint8)]), cv2.COLOR_LAB2BGR)
    final_royal = (royal_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-royal-blue.jpg"), final_royal, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 7. Maroon
    L_maroon = np.clip(L_r * 0.55, 0, 255)
    A_maroon = np.where(dilated > 0, 168.0, A_r)
    B_maroon = np.where(dilated > 0, 142.0, B_r)
    maroon_bgr = cv2.cvtColor(cv2.merge([L_maroon.astype(np.uint8), A_maroon.astype(np.uint8), B_maroon.astype(np.uint8)]), cv2.COLOR_LAB2BGR)
    final_maroon = (maroon_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-maroon.jpg"), final_maroon, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 8. Orange (from Red in HSV)
    hsv_r = cv2.cvtColor(r_img, cv2.COLOR_BGR2HSV).astype(float)
    hsv_orange = hsv_r.copy()
    hsv_orange[:, :, 0] = np.where(dilated > 0, 15.0, hsv_orange[:, :, 0])
    hsv_orange[:, :, 1] = np.where(dilated > 0, np.clip(hsv_orange[:, :, 1] * 0.95, 0, 255), hsv_orange[:, :, 1])
    hsv_orange[:, :, 2] = np.where(dilated > 0, np.clip(hsv_orange[:, :, 2] * 1.15, 0, 255), hsv_orange[:, :, 2])
    orange_bgr = cv2.cvtColor(hsv_orange.astype(np.uint8), cv2.COLOR_HSV2BGR)
    final_orange = (orange_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-orange.jpg"), final_orange, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 9. Yellow (bright sunshine yellow from Red in HSV)
    hsv_yellow = hsv_r.copy()
    hsv_yellow[:, :, 0] = np.where(dilated > 0, 28.0, hsv_yellow[:, :, 0])
    hsv_yellow[:, :, 1] = np.where(dilated > 0, 220.0, hsv_yellow[:, :, 1])
    hsv_yellow[:, :, 2] = np.where(dilated > 0, np.clip(hsv_yellow[:, :, 2] * 1.30, 0, 255), hsv_yellow[:, :, 2])
    yellow_bgr = cv2.cvtColor(hsv_yellow.astype(np.uint8), cv2.COLOR_HSV2BGR)
    final_yellow = (yellow_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-yellow.jpg"), final_yellow, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 10. Dark Yellow / Mustard
    hsv_dy = hsv_r.copy()
    hsv_dy[:, :, 0] = np.where(dilated > 0, 22.0, hsv_dy[:, :, 0])
    hsv_dy[:, :, 1] = np.where(dilated > 0, 235.0, hsv_dy[:, :, 1])
    hsv_dy[:, :, 2] = np.where(dilated > 0, np.clip(hsv_dy[:, :, 2] * 1.05, 0, 255), hsv_dy[:, :, 2])
    dy_bgr = cv2.cvtColor(hsv_dy.astype(np.uint8), cv2.COLOR_HSV2BGR)
    final_dy = (dy_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-dark-yellow.jpg"), final_dy, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 11. Brown (rich chocolate brown)
    hsv_brown = hsv_r.copy()
    hsv_brown[:, :, 0] = np.where(dilated > 0, 16.0, hsv_brown[:, :, 0])
    hsv_brown[:, :, 1] = np.where(dilated > 0, 175.0, hsv_brown[:, :, 1])
    hsv_brown[:, :, 2] = np.where(dilated > 0, np.clip(hsv_brown[:, :, 2] * 0.48, 0, 255), hsv_brown[:, :, 2])
    brown_bgr = cv2.cvtColor(hsv_brown.astype(np.uint8), cv2.COLOR_HSV2BGR)
    final_brown = (brown_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-brown.jpg"), final_brown, [cv2.IMWRITE_JPEG_QUALITY, 95])
    
    # 12. Purple
    hsv_purple = hsv_r.copy()
    hsv_purple[:, :, 0] = np.where(dilated > 0, 142.0, hsv_purple[:, :, 0])
    hsv_purple[:, :, 1] = np.where(dilated > 0, np.clip(hsv_purple[:, :, 1] * 0.90, 0, 255), hsv_purple[:, :, 1])
    hsv_purple[:, :, 2] = np.where(dilated > 0, np.clip(hsv_purple[:, :, 2] * 0.72, 0, 255), hsv_purple[:, :, 2])
    purple_bgr = cv2.cvtColor(hsv_purple.astype(np.uint8), cv2.COLOR_HSV2BGR)
    final_purple = (purple_bgr.astype(float) * alpha_3d + r_img.astype(float) * (1.0 - alpha_3d)).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f"{out_prefix}-purple.jpg"), final_purple, [cv2.IMWRITE_JPEG_QUALITY, 95])

    print(f"Generated all colors for {out_prefix}")

if __name__ == "__main__":
    generate_garment_colors("polo", "kids_polo_white_1790587072090.jpg", "kids_polo_red_test_1790589679540.jpg", "kids-polo-tshirt")
    generate_garment_colors("sweat", "kids_sweat_white_1790587100910.jpg", "kids_sweat_red_test_1790589709126.jpg", "kids-sweatshirt")
    generate_garment_colors("hoodie", "kids_hoodie_white_1790587126255.jpg", "kids_hoodie_red_test_1790589740124.jpg", "kids-hoodie")
