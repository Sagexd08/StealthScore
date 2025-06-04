#!/usr/bin/env python3
"""
Test script for PitchGuard Lite Backend
Tests encryption, decryption, and API functionality
"""

import base64
import json
import requests
import time
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

def generate_test_data():
    """Generate test encryption data similar to frontend"""
    
    # Sample pitch text
    pitch_text = """
    Our startup, EcoClean, revolutionizes urban waste management through AI-powered sorting robots. 
    We've identified that 60% of recyclable materials end up in landfills due to improper sorting. 
    Our solution uses computer vision and machine learning to achieve 95% sorting accuracy, 
    reducing waste processing costs by 40%. With a team of MIT engineers and partnerships with 
    3 major cities, we're seeking $2M to scale our pilot program nationwide.
    """.strip()
    
    # Generate key and IV
    key = AESGCM.generate_key(bit_length=256)
    iv = os.urandom(12)
    
    # Encrypt
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(iv, pitch_text.encode('utf-8'), None)
    
    # Convert to base64
    return {
        'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
        'iv': base64.b64encode(iv).decode('utf-8'),
        'aes_key': base64.b64encode(key).decode('utf-8'),
        'original_text': pitch_text
    }

def test_health_endpoint(base_url):
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_score_endpoint(base_url):
    """Test the score endpoint with encrypted data"""
    print("🔍 Testing score endpoint...")
    
    # Generate test data
    test_data = generate_test_data()
    print(f"📝 Original pitch length: {len(test_data['original_text'])} characters")
    
    # Prepare payload
    payload = {
        'ciphertext': test_data['ciphertext'],
        'iv': test_data['iv'],
        'aes_key': test_data['aes_key']
    }
    
    try:
        response = requests.post(
            f"{base_url}/score",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            scores = data['scores']
            receipt = data['receipt']
            
            print("✅ Scoring successful!")
            print(f"📊 Scores:")
            print(f"   Clarity: {scores['clarity']:.1f}/10.0")
            print(f"   Originality: {scores['originality']:.1f}/10.0")
            print(f"   Team Strength: {scores['team_strength']:.1f}/10.0")
            print(f"   Market Fit: {scores['market_fit']:.1f}/10.0")
            print(f"🧾 Receipt: {receipt[:16]}...")
            
            # Validate scores
            for criterion, score in scores.items():
                if not (0.0 <= score <= 10.0):
                    print(f"⚠️  Warning: {criterion} score {score} is out of range")
                    return False
            
            return True
            
        else:
            print(f"❌ Scoring failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('detail', 'Unknown error')}")
            except:
                print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Scoring error: {e}")
        return False

def test_invalid_data(base_url):
    """Test with invalid data to ensure proper error handling"""
    print("🔍 Testing error handling...")
    
    # Test with invalid base64
    invalid_payload = {
        'ciphertext': 'invalid_base64!',
        'iv': 'also_invalid!',
        'aes_key': 'not_base64!'
    }
    
    try:
        response = requests.post(
            f"{base_url}/score",
            json=invalid_payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 422:  # Validation error
            print("✅ Validation error handling works correctly")
            return True
        else:
            print(f"⚠️  Expected validation error, got: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def main():
    """Run all tests"""
    base_url = "http://localhost:8000"
    
    print("🚀 PitchGuard Lite Backend Test Suite")
    print("=" * 50)
    
    # Check if OpenRouter API key is set
    api_key = os.getenv('OPENROUTER_API_KEY')
    if not api_key:
        print("⚠️  Warning: OPENROUTER_API_KEY not set. AI scoring may fail.")
        print("   Set it with: export OPENROUTER_API_KEY=your_key_here")
    else:
        print("✅ OpenRouter API key is configured")
    
    print()
    
    # Run tests
    tests = [
        ("Health Check", lambda: test_health_endpoint(base_url)),
        ("Score Endpoint", lambda: test_score_endpoint(base_url)),
        ("Error Handling", lambda: test_invalid_data(base_url))
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        if test_func():
            passed += 1
        time.sleep(1)  # Brief pause between tests
    
    print("\n" + "=" * 50)
    print(f"📈 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Backend is working correctly.")
        print("\n💡 Next steps:")
        print("   1. Open frontend/index.html in your browser")
        print("   2. Try submitting a pitch")
        print("   3. Verify the scores and receipt are displayed")
    else:
        print("❌ Some tests failed. Check the output above for details.")
        print("\n🔧 Troubleshooting:")
        print("   1. Ensure the backend is running on port 8000")
        print("   2. Check that OPENROUTER_API_KEY is set correctly")
        print("   3. Verify internet connectivity for AI API calls")

if __name__ == "__main__":
    main()