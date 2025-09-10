#!/usr/bin/env python3
"""
Script to upload sample food images to Cloudinary for the Foodie application.
This script will upload placeholder food images and return the public IDs for use in the database.
"""

import cloudinary
import cloudinary.uploader
import requests
from PIL import Image, ImageDraw, ImageFont
import io
import os

# Configure Cloudinary
cloudinary.config(
    cloud_name="dgkyhspuf",
    api_key="your_api_key_here",  # Replace with your actual API key
    api_secret="your_api_secret_here"  # Replace with your actual API secret
)

def create_food_image(text, color, size=(800, 600)):
    """Create a placeholder food image with text."""
    # Create image with specified color
    img = Image.new('RGB', size, color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a default font, fallback to basic if not available
    try:
        font = ImageFont.truetype("arial.ttf", 48)
    except:
        font = ImageFont.load_default()
    
    # Get text dimensions
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Calculate position to center text
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    
    # Draw text with shadow
    draw.text((x+2, y+2), text, fill='black', font=font)  # Shadow
    draw.text((x, y), text, fill='white', font=font)  # Main text
    
    # Add a subtle border
    draw.rectangle([0, 0, size[0]-1, size[1]-1], outline='white', width=3)
    
    return img

def upload_image_to_cloudinary(image, public_id, folder="foodie"):
    """Upload an image to Cloudinary."""
    # Convert PIL image to bytes
    img_buffer = io.BytesIO()
    image.save(img_buffer, format='JPEG', quality=85)
    img_buffer.seek(0)
    
    try:
        result = cloudinary.uploader.upload(
            img_buffer,
            public_id=f"{folder}/{public_id}",
            folder=folder,
            resource_type="image",
            transformation=[
                {"width": 800, "height": 600, "crop": "fill"},
                {"quality": "auto"},
                {"format": "auto"}
            ]
        )
        return result['public_id']
    except Exception as e:
        print(f"Error uploading {public_id}: {e}")
        return None

def main():
    """Upload all sample food images to Cloudinary."""
    
    # Define food images to create and upload
    food_images = [
        {
            "filename": "carbonara",
            "text": "Italian Carbonara",
            "color": "#8B4513"  # Brown
        },
        {
            "filename": "cookies",
            "text": "Chocolate Cookies",
            "color": "#D2691E"  # Chocolate
        },
        {
            "filename": "ramen",
            "text": "Ramen Bowl",
            "color": "#FF6347"  # Tomato
        },
        {
            "filename": "buddha-bowl",
            "text": "Buddha Bowl",
            "color": "#32CD32"  # Lime Green
        },
        {
            "filename": "brisket",
            "text": "Smoked Brisket",
            "color": "#A0522D"  # Sienna
        },
        {
            "filename": "tiramisu",
            "text": "Tiramisu Cake",
            "color": "#F5DEB3"  # Wheat
        },
        {
            "filename": "butter-chicken",
            "text": "Butter Chicken",
            "color": "#FF8C00"  # Dark Orange
        },
        {
            "filename": "smoothie-bowl",
            "text": "Smoothie Bowl",
            "color": "#00FF7F"  # Spring Green
        },
        {
            "filename": "pizza",
            "text": "Margherita Pizza",
            "color": "#FF0000"  # Red
        },
        {
            "filename": "sushi",
            "text": "Sushi Roll",
            "color": "#FFD700"  # Gold
        }
    ]
    
    print("🍽️ Uploading sample food images to Cloudinary...")
    print("=" * 50)
    
    uploaded_images = {}
    
    for food in food_images:
        print(f"Creating and uploading: {food['text']}")
        
        # Create the image
        image = create_food_image(food['text'], food['color'])
        
        # Upload to Cloudinary
        public_id = upload_image_to_cloudinary(image, food['filename'])
        
        if public_id:
            uploaded_images[food['filename']] = public_id
            print(f"✅ Uploaded: {public_id}")
        else:
            print(f"❌ Failed to upload: {food['filename']}")
    
    print("\n" + "=" * 50)
    print("📋 Cloudinary Public IDs for your seed data:")
    print("=" * 50)
    
    for filename, public_id in uploaded_images.items():
        print(f'"{filename}": "{public_id}",')
    
    print("\n🎉 Upload complete!")
    print("Copy the public IDs above and update your seed.go file with these values.")

if __name__ == "__main__":
    main()
