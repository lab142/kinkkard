//
//  ContentView.swift
//  Kink list
//
//  Created on 12/6/24.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    
    var body: some View {
        Group {
            switch onboardingManager.currentOnboardingStep {
            case .orientation:
                OrientationView()
            case .positions:
                PositionsSelectionView()
            case .kinks:
                KinksSelectionView()
            case .complete:
                MainAppView()
            }
        }
        .transition(.opacity)
        .animation(.easeInOut, value: onboardingManager.currentOnboardingStep)
    }
}

#Preview {
    ContentView()
        .environmentObject(OnboardingManager())
}


