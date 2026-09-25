//
//  OnboardingManager.swift
//  Kink list
//
//  Created on 12/6/24.
//

import Foundation
import SwiftUI

class OnboardingManager: ObservableObject {
    @Published var userProfile: UserProfile
    @Published var currentOnboardingStep: OnboardingStep
    
    enum OnboardingStep {
        case orientation
        case positions
        case kinks
        case complete
    }
    
    init() {
        self.userProfile = UserProfile()
        // Always start with orientation - ensures everyone gets the same flow
        self.currentOnboardingStep = .orientation
        loadUserProfile()
    }
    
    // MARK: - Onboarding Flow Control
    
    func completeOrientation(orientation: String) {
        userProfile.orientation = orientation
        userProfile.hasCompletedOrientation = true
        // Automatically move to positions step
        currentOnboardingStep = .positions
        saveUserProfile()
    }
    
    func completePositions(positions: [String]) {
        userProfile.positions = positions
        userProfile.hasCompletedPositions = true
        // Automatically move to kinks step
        currentOnboardingStep = .kinks
        saveUserProfile()
    }
    
    func completeKinks(kinks: [String]) {
        userProfile.kinks = kinks
        userProfile.hasCompletedKinks = true
        currentOnboardingStep = .complete
        saveUserProfile()
    }
    
    // MARK: - Navigation Helpers
    
    func canProceedToPositions() -> Bool {
        return userProfile.hasCompletedOrientation
    }
    
    func canProceedToKinks() -> Bool {
        return userProfile.hasCompletedOrientation && userProfile.hasCompletedPositions
    }
    
    // MARK: - Persistence
    
    private func saveUserProfile() {
        if let encoded = try? JSONEncoder().encode(userProfile) {
            UserDefaults.standard.set(encoded, forKey: "userProfile")
        }
    }
    
    private func loadUserProfile() {
        if let data = UserDefaults.standard.data(forKey: "userProfile"),
           let decoded = try? JSONDecoder().decode(UserProfile.self, from: data) {
            self.userProfile = decoded
            
            // Determine current step based on completion status
            if !userProfile.hasCompletedOrientation {
                currentOnboardingStep = .orientation
            } else if !userProfile.hasCompletedPositions {
                currentOnboardingStep = .positions
            } else if !userProfile.hasCompletedKinks {
                currentOnboardingStep = .kinks
            } else {
                currentOnboardingStep = .complete
            }
        }
    }
    
    func resetOnboarding() {
        userProfile = UserProfile()
        currentOnboardingStep = .orientation
        UserDefaults.standard.removeObject(forKey: "userProfile")
    }
}


