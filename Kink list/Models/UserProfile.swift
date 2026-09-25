//
//  UserProfile.swift
//  Kink list
//
//  Created on 12/6/24.
//

import Foundation

struct UserProfile: Codable, Identifiable {
    var id: UUID
    var orientation: String?
    var positions: [String]
    var kinks: [String]
    var hasCompletedOrientation: Bool
    var hasCompletedPositions: Bool
    var hasCompletedKinks: Bool
    
    init(id: UUID = UUID()) {
        self.id = id
        self.orientation = nil
        self.positions = []
        self.kinks = []
        self.hasCompletedOrientation = false
        self.hasCompletedPositions = false
        self.hasCompletedKinks = false
    }
    
    var isOnboardingComplete: Bool {
        return hasCompletedOrientation && hasCompletedPositions && hasCompletedKinks
    }
}


