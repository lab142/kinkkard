//
//  KinkListApp.swift
//  Kink list
//
//  Created on 12/6/24.
//

import SwiftUI

@main
struct KinkListApp: App {
    @StateObject private var onboardingManager = OnboardingManager()
    @StateObject private var guestViewModel = GuestProfileViewModel()  // ✅ Add guestViewModel at app level
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(onboardingManager)
                .environmentObject(guestViewModel)  // ✅ Pass to all views
        }
    }
}


