//
//  MatchResultsView.swift
//  Kink list
//
//  Created on 12/7/24.
//

import SwiftUI

struct MatchResultsView: View {
    @EnvironmentObject var onboardingManager: OnboardingManager
    @EnvironmentObject var guestViewModel: GuestProfileViewModel
    @Environment(\.dismiss) var dismiss  // ✅ For dismissing sheet
    
    // Use @State variables to ensure they're calculated and stored
    @State private var matchingKinks: [String] = []
    @State private var wouldTryCrossMatches: [String] = []
    @State private var bothWouldTryMatches: [String] = []
    @State private var matchingPositions: [String] = []
    
    // Convert user profile kinks to sets (assuming all are "into" for now, but we'll extend this)
    private var userIntoKinks: Set<String> {
        Set(onboardingManager.userProfile.kinks)
    }
    
    private var userWouldTryKinks: Set<String> {
        // For now, we'll need to extend UserProfile to support "would try" kinks
        // For version 8.5, we'll assume all kinks are "into" and add wouldTry support later
        Set<String>()
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Text("🔥 Shared Interests")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding(.top)
                    
                    Divider().background(Color.white.opacity(0.5))
                    
                    // Matching Positions
                    VStack(alignment: .leading, spacing: 15) {
                        Text("❤️ Matching Favorite Positions:")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        if matchingPositions.isEmpty {
                            Text("No matching positions found!")
                                .foregroundColor(.gray)
                                .italic()
                        } else {
                            WrapGrid(items: matchingPositions, color: Color.red)
                        }
                    }
                    .padding(.horizontal, 15)
                    
                    Divider().background(Color.white.opacity(0.5))
                    
                    // Matching Kinks (Both "Into")
                    VStack(alignment: .leading, spacing: 15) {
                        Text("🔥 Matching Kinks:")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        if matchingKinks.isEmpty {
                            Text("No matching kinks found!")
                                .foregroundColor(.gray)
                                .italic()
                        } else {
                            WrapGrid(items: matchingKinks, color: Color.pink)
                        }
                    }
                    .padding(.horizontal, 15)
                    
                    Divider().background(Color.white.opacity(0.5))
                    
                    // "Would Try" Cross Matches (Into ↔ Would Try)
                    VStack(alignment: .leading, spacing: 15) {
                        Text("💡 Would Try Matches:")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        if wouldTryCrossMatches.isEmpty {
                            Text("No 'Would Try' cross-matches found!")
                                .foregroundColor(.gray)
                                .italic()
                        } else {
                            WrapGrid(items: wouldTryCrossMatches, color: Color.blue)
                        }
                    }
                    .padding(.horizontal, 15)
                    
                    Divider().background(Color.white.opacity(0.5))
                    
                    // ✅ Both "Would Try" Matches - THIS IS THE KEY FUNCTIONALITY
                    VStack(alignment: .leading, spacing: 15) {
                        Text("✨ Both Would Try:")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        if bothWouldTryMatches.isEmpty {
                            VStack(alignment: .leading, spacing: 5) {
                                Text("No 'Both Would Try' matches found!")
                                    .foregroundColor(.gray)
                                    .italic()
                                Text("Main user has \(userWouldTryKinks.count) 'Would Try' kinks")
                                    .font(.caption)
                                    .foregroundColor(.gray.opacity(0.7))
                                Text("Guest user has \(guestViewModel.wouldTryKinks.count) 'Would Try' kinks")
                                    .font(.caption)
                                    .foregroundColor(.gray.opacity(0.7))
                            }
                        } else {
                            WrapGrid(items: bothWouldTryMatches, color: Color.cyan)
                        }
                    }
                    .padding(.horizontal, 15)
                    
                    // Back Button
                    Button(action: {
                        dismiss()  // ✅ Dismiss the sheet
                    }) {
                        Text("Done")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.blue)
                            .cornerRadius(12)
                    }
                    .padding(.horizontal, 40)
                    .padding(.bottom, 20)
                }
            }
            .background(Color.black.edgesIgnoringSafeArea(.all))
            .navigationTitle("Match Results")
            .navigationBarTitleDisplayMode(.inline)
            .onAppear {
                print("\n" + String(repeating: "=", count: 60))
                print("📊 MatchResultsView APPEARED - CALLING calculateAllMatches()")
                calculateAllMatches()
                print(String(repeating: "=", count: 60) + "\n")
            }
            .onChange(of: guestViewModel.wouldTryKinks) { _ in
                print("🔄 Guest user wouldTryKinks changed, recalculating...")
                calculateAllMatches()
            }
        }
    }
    
    // Calculate all matches and store in @State variables
    private func calculateAllMatches() {
        print("\n🔴🔴🔴 calculateAllMatches() STARTED 🔴🔴🔴")
        print("👤 MAIN USER:")
        print("   Into Kinks: \(Array(userIntoKinks).sorted())")
        print("   Would Try Kinks: \(Array(userWouldTryKinks).sorted())")
        print("   Positions: \(onboardingManager.userProfile.positions)")
        print("👥 GUEST USER:")
        print("   Into Kinks: \(Array(guestViewModel.intoKinks).sorted())")
        print("   Would Try Kinks: \(Array(guestViewModel.wouldTryKinks).sorted())")
        print("   Positions: \(Array(guestViewModel.favoritePositions).sorted())")
        
        // Calculate Matching Kinks (Both "Into")
        matchingKinks = Array(userIntoKinks.intersection(guestViewModel.intoKinks))
        print("🔥 Matching Kinks: \(matchingKinks)")
        
        // Calculate Cross Matches (Into ↔ Would Try)
        let intoToWouldTry = userIntoKinks.intersection(guestViewModel.wouldTryKinks)
        let wouldTryToInto = userWouldTryKinks.intersection(guestViewModel.intoKinks)
        wouldTryCrossMatches = Array(intoToWouldTry.union(wouldTryToInto))
        print("💡 Would Try Cross Matches: \(wouldTryCrossMatches)")
        
        // Calculate BOTH "Would Try" Matches - THIS IS THE KEY!
        print("\n✨✨✨ CALCULATING BOTH WOULD TRY MATCHES ✨✨✨")
        let userWouldTry = userWouldTryKinks
        let guestWouldTry = guestViewModel.wouldTryKinks
        
        print("   Main User Would Try: \(Array(userWouldTry).sorted())")
        print("   Guest User Would Try: \(Array(guestWouldTry).sorted())")
        
        bothWouldTryMatches = Array(userWouldTry.intersection(guestWouldTry))
        
        print("   ✅ BOTH WOULD TRY RESULT: \(bothWouldTryMatches.sorted())")
        print("   Count: \(bothWouldTryMatches.count)")
        
        if bothWouldTryMatches.isEmpty && !userWouldTry.isEmpty && !guestWouldTry.isEmpty {
            print("   ⚠️ WARNING: Both have would try kinks but no matches!")
        }
        print("✨✨✨ END BOTH WOULD TRY CALCULATION ✨✨✨\n")
        
        // Calculate Matching Positions
        matchingPositions = Array(Set(onboardingManager.userProfile.positions).intersection(guestViewModel.favoritePositions))
        print("🛏️ Matching Positions: \(matchingPositions)")
        print("🔴🔴🔴 calculateAllMatches() COMPLETE 🔴🔴🔴\n")
    }
}

